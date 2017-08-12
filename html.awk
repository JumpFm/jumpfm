#!/usr/bin/awk -f

{
	if(/<!--/){
		print $0
	}else{
		if(match($0, /import '(.*)'/, a)){
			system("./html.awk " a[1])
		}
		else{
			print $0
		}
	}
}
