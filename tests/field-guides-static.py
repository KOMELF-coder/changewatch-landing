from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse,unquote
import xml.etree.ElementTree as ET,json,subprocess,hashlib,csv,os
r=Path(__file__).resolve().parent.parent; base='https://changewatch.cybersignal.fr'; temp=Path(os.environ['TEMP'])
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.links=[];self.ids=set();self.images=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag in ('a','link') and a.get('href'):self.links.append(a['href'])
  if tag in ('img','script') and a.get('src'):self.links.append(a['src'])
  if tag=='img':self.images.append(a)
pages={p:Page(p.read_text(encoding='utf-8-sig')) for p in r.rglob('*.html') if '.git' not in p.parts and 'docs' not in p.parts}
errors=[];external=set();count=0
for p,parsed in pages.items():
 url=base+'/'+p.relative_to(r).as_posix()
 for ref in parsed.links:
  u=urlparse(urljoin(url,ref))
  if u.scheme not in ['http','https']:continue
  if u.netloc!='changewatch.cybersignal.fr':external.add(u.geturl());continue
  target=r/unquote(u.path).lstrip('/');target=target/'index.html' if target.is_dir() else target
  if not target.exists():errors.append([str(p.relative_to(r)),ref,'missing file'])
  elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append([str(p.relative_to(r)),ref,'missing anchor'])
  count+=1
 for img in parsed.images:
  if 'alt' not in img:errors.append([str(p),'missing alt',img])
assert not errors,errors
oldfiles=subprocess.check_output(['git','ls-tree','-r','--name-only','69d002d'],cwd=r,text=True).splitlines(); allowed={'assets/analytics-frame.js','assets/consent.js','blog/index.html','en/blog/index.html','sitemap.xml'}
preserved=[]
for name in oldfiles:
 if name in allowed:continue
 if not (r/name).is_file():raise AssertionError('removed '+name)
 original=subprocess.check_output(['git','show','69d002d:'+name],cwd=r)
 assert original.replace(b'\r\n',b'\n')==(r/name).read_bytes().replace(b'\r\n',b'\n'),'changed existing '+name
 preserved.append(name)
oldmap=ET.fromstring(subprocess.check_output(['git','show','69d002d:sitemap.xml'],cwd=r));newmap=ET.parse(r/'sitemap.xml').getroot();assert all([(c.tag,c.text) for c in x] in [[(c.tag,c.text) for c in y] for y in newmap] for x in oldmap)
assert len(newmap)==len(oldmap)+2
resources={}
for name in ['veille-exemple-journal-fictif.csv','veille-exemple-modele.csv']:
 with (r/'assets'/name).open(encoding='utf-8-sig',newline='') as f:rows=list(csv.reader(f))
 assert all(len(row)==16 for row in rows);assert all(not cell.startswith(('=','+','-','@')) for row in rows for cell in row)
 resources[name]={'rows':len(rows)-1,'columns':16}
 assert len(rows)==(25 if 'journal' in name else 2)
 if 'journal' in name:
  counts={s:sum(row[9]==s for row in rows[1:]) for s in ['Première observation','Sans changement observé','Changement confirmé','À confirmer','Échec de lecture']};assert list(counts.values())==[6,13,3,1,1];resources[name]['statuses']=counts
result={'pages':len(pages),'local_link_checks':count,'errors':errors,'unchanged_existing_files':len(preserved),'sitemap_urls':len(newmap),'CSV':resources}
(temp/'cw-sept24-static.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');(temp/'cw-sept24-external.json').write_text(json.dumps(sorted(external)),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
