from pathlib import Path
import subprocess,json,re,xml.etree.ElementTree as ET
r=Path(__file__).resolve().parent.parent;base='d6c7bcc'
old=lambda f:subprocess.check_output(['git','show',base+':'+f],cwd=r)
articles=[x['file'] for x in json.loads((r/'docs/price-surveillance-tool/existing-articles.json').read_text(encoding='utf-8'))]
for f in articles+['assets/blog-comments.js','assets/blog-comments.css','script.js','index.html','en/index.html','CNAME','google20898eface6e8c69.html','assets/blog.css','styles.css']:
 assert old(f).replace(b'\r\n',b'\n')==(r/f).read_bytes().replace(b'\r\n',b'\n'),f
for f in ['assets/consent.js','assets/analytics-frame.js']:
 t=(r/f).read_text(encoding='utf-8');o=old(f).decode().replace('\r\n','\n')
 if f.endswith('consent.js'):t=''.join(line for line in t.splitlines(keepends=True) if not re.match(r"    \['/(?:en/)?blog/(?:surveillance-prix-concurrents|competitor-monitor-tool)/'",line))
 else:t=re.sub(r"'/(?:en/)?blog/(?:surveillance-prix-concurrents|competitor-monitor-tool)/', ",'',t)
 assert t==o,f+' only route additions'
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'};before=ET.fromstring(old('sitemap.xml'));after=ET.parse(r/'sitemap.xml').getroot();urls=lambda tree:[x.text for x in tree.findall('s:url/s:loc',ns)];assert set(urls(before))<=set(urls(after));assert len(urls(after))==20==len(set(urls(after)))
for lang,slug in [('fr','surveillance-prix-concurrents'),('en','competitor-monitor-tool')]:
 route=('/blog/' if lang=='fr' else '/en/blog/')+slug+'/';t=(r/route.lstrip('/')/'index.html').read_text(encoding='utf-8');assert f'data-article-slug="{slug}"' in t;assert t.count('src="/assets/blog-comments.js"')==1;assert 'hreflang=' not in t
print('PASS all eight old articles byte-identical, comments/style/form/Stripe/CNAME/Search Console unchanged, Google scripts changed only by two allowed routes, 20 unique sitemap URLs, independent article slugs.')
