import datetime

def parse_time(s):
	if '.' not in s:
		s += '.000'
	else:
 		s += '000'
	s = '0' + s
	return s[:12]

step = 0.001
print "WEBVTT\n"
for i in range(10000):
	print i
	print parse_time(str(datetime.timedelta(seconds=i*step))) + ' --> ' + parse_time(str(datetime.timedelta(seconds=(i + 1)*step)))
        print str(i)
	print ""
