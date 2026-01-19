echo '------------------sign------------------'
check_result=$(curl -H "cookie:${COOKIE}" -H 'content-type:application/json;charset=UTF-8' -d '{"token": "glados.cloud"}' -X POST 'https://glados.cloud/api/user/checkin' | grep -Eo '"message":"[^"]*"')
echo $check_result
curl -X POST 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=53728003-3d74-407e-94bb-a83140088047' -H 'Content-Type: application/json' -d "{\"msgtype\": \"text\", \"text\": {\"content\": \"${check_result//\"}\"}}"
echo '-----------------status-----------------'
status_result=$(curl -H "cookie:${COOKIE}" -X GET 'https://glados.cloud/api/user/status' | grep -Eo '"leftDays":"[^"]*"')
echo $status_result
curl -X POST 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=53728003-3d74-407e-94bb-a83140088047' -H 'Content-Type: application/json' -d "{\"msgtype\": \"text\", \"text\": {\"content\": \"${status_result//\"}\"}}"