#!/usr/bin/awk -f
BEGIN { 
	RS="}"
	print "{"
}

match($0, /icon: '([^']+)'.*extensions: (\[[^\].]+\])/, a){
	print "\""a[1]"\"", ":", gensub(/'/,"\"", "g", a[2])","
}	

match($0, /icon: '([^']+)'.*languages: (\[[^\]]+\])/, a){
	print "\""a[1]"\"", ":", gensub(/languages\.(\w+)/, "\"\\1\"", "g", a[2])","
}	

END {
	print "}"
}
