#!/usr/bin/awk -f
BEGIN { 
	RS="}"
}

match($0, /icon: '([^']+)'.*extensions: (\[[^\]]*\])/, a){
	print "\""a[1]"\"", ":", a[2]
}	
