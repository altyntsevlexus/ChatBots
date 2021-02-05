# Troubleshooting

**Server Error:** const myUser = myStorage.find(user => user.id === id) 

**Explanation:** Such error may appear if you restart server "start" task, due to the fact that saved ID in localStorage won't be find in the myStorage (it is empty). 

**Solution:** Clear your localStorage