echo '------------------sign------------------'
base_url='https://glados.rocks'
user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'

check_result=$(curl -sS -X POST "${base_url}/api/user/checkin" \
  -H "cookie:${COOKIE}" \
  -H 'accept:application/json, text/plain, */*' \
  -H 'content-type:application/json;charset=UTF-8' \
  -H "origin:${base_url}" \
  -H 'referer:https://glados.rocks/console/checkin' \
  -H 'sec-ch-ua:"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"' \
  -H 'sec-ch-ua-mobile:?0' \
  -H 'sec-ch-ua-platform:"macOS"' \
  -H 'sec-fetch-dest:empty' \
  -H 'sec-fetch-mode:cors' \
  -H 'sec-fetch-site:same-origin' \
  -H "user-agent:${user_agent}" \
  --data-raw '{"token":"glados.one"}' | grep -Eo '"message":"[^"]*"')
echo $check_result
curl -X POST 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=53728003-3d74-407e-94bb-a83140088047' -H 'Content-Type: application/json' -d "{\"msgtype\": \"text\", \"text\": {\"content\": \"${check_result//\"}\"}}"
echo '-----------------status-----------------'
status_result=$(curl -sS -X GET "${base_url}/api/user/status" \
  -H "cookie:${COOKIE}" \
  -H 'accept:application/json, text/plain, */*' \
  -H "referer:${base_url}/console/checkin" \
  -H "user-agent:${user_agent}" | grep -Eo '"leftDays":"[^"]*"')
echo $status_result
curl -X POST 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=53728003-3d74-407e-94bb-a83140088047' -H 'Content-Type: application/json' -d "{\"msgtype\": \"text\", \"text\": {\"content\": \"${status_result//\"}\"}}"
