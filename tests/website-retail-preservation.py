from pathlib import Path
import json,re,subprocess,xml.etree.ElementTree as ET
r=Path(__file__).resolve().parent.parent
base='3ccfe3b287a1275a1543835479c95d8966e05a61'
old=lambda f:subprocess.check_output(['git','show',base+':'+f],cwd=r).replace(b'\r\n',b'\n')
articles=json.loads((r/'docs/website-retail-guides/existing-articles.json').read_text(encoding='utf-8'))
assert len(articles)==10
for x in articles:
 f=x['file'];assert old(f)==(r/f).read_bytes().replace(b'\r\n',b'\n'),f
# Every pre-existing tracked file is identical except the six explicitly allowed integration files.
allowed={'assets/consent.js','assets/analytics-frame.js','blog/index.html','en/blog/index.html','sitemap.xml','tests/blog-comments.cjs'}
files=subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=r,text=True).splitlines()
for f in files:
 if f not in allowed:assert old(f)==(r/f).read_bytes().replace(b'\r\n',b'\n'),f+' unexpectedly changed'
slugs='(?:veille-concurrentielle-site-internet|retail-price-monitoring)'
for f in ['assets/consent.js','assets/analytics-frame.js']:
 s=(r/f).read_text(encoding='utf-8')
 if f.endswith('consent.js'):s=''.join(line for line in s.splitlines(keepends=True) if not re.match(r"    \['/(?:en/)?blog/"+slugs+r"/'",line))
 else:s=re.sub(r"'/(?:en/)?blog/"+slugs+r"/', ",'',s)
 assert s==old(f).decode(),f+' logic changed'
for f in ['blog/index.html','en/blog/index.html']:
 s=(r/f).read_text(encoding='utf-8');s=re.sub(r'<article class="post-card"[^>]*>[^\n]*(?:website-watch-fr|retail-check-en)[^\n]*</article>\n','',s)
 assert s==old(f).decode(),f+' old cards changed'
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
before=ET.fromstring(old('sitemap.xml'));after=ET.parse(r/'sitemap.xml').getroot()
entries=lambda t:{e.find('s:loc',ns).text:e for e in t}
a,b=entries(before),entries(after);assert len(b)==len(after)==len(a)+2==22
for u,e in a.items():
 assert u in b
 if u.endswith('/blog/'):assert b[u].find('s:lastmod',ns).text=='2026-10-01'
 else:assert ET.tostring(e).strip()==ET.tostring(b[u]).strip(),u
for lang,slug in [('fr','veille-concurrentielle-site-internet'),('en','retail-price-monitoring')]:
 route=('/blog/' if lang=='fr' else '/en/blog/')+slug+'/'
 s=(r/route.lstrip('/')/'index.html').read_text(encoding='utf-8');assert 'datePublished' not in s;assert '"dateModified": "2026-10-01"' in s
 assert f'data-article-slug="{slug}"' in s;assert s.count('src="/assets/blog-comments.js"')==1;assert 'hreflang=' not in s
 assert b['https://changewatch.cybersignal.fr'+route].find('s:lastmod',ns).text=='2026-10-01'
print('PASS 10 old articles and every other pre-existing file preserved except six integrations; Google logic identical, old cards unchanged, 22 sitemap URLs, new draft metadata/comments slugs valid.')
