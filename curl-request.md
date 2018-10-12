## Curl request for testing purpose


### Get users by location
curl https://api.github.com/search/users?q=location:Vaud

### Get users details
curl https://api.github.com/users/lbeopennet

### Get the user languages
curl -i https://api.github.com/users/kamkill01011/repos

or

curl -G https://api.github.com/search/repositories?q=@kamkill01011 --data-urlencode 'q=@kamkill01011' -H 'Accept: application/vnd.github.preview'  > kamkill0101.txt