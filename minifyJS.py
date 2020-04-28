import http.client, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.
jsFile = ''
with open(sys.argv[1], 'r') as f:
    jsFile = f.read();

params = urllib.parse.urlencode([
    ('js_code', jsFile),
    ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
    ('output_format', 'text'),
    ('output_info', 'compiled_code'),
  ])

'''
OPTIMIZATIONS
WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS
'''

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = http.client.HTTPSConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
#print(data)
#print(type(data))
conn.close()

fileName = (sys.argv[1]).split('.')
minFile = F'{fileName[0]}.min.js'

with open(minFile, 'wb') as f:
    f.write(data)