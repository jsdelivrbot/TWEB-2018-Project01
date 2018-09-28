## Curl request for testing purpose


### Get users by location
curl https://api.github.com/search/users?q=location:Vaud

### Get the user languages
curl -G https://api.github.com/search/repositories --data-urlencode 'q=@kamkill01011' -H 'Accept: application/vnd.github.preview'  > kamkill0101.txt