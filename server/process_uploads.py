import pyrebase #import pyrebase
import datetime #import datetime
import time #import time

config = { #sets up judge-prefs-pfd firebase
  "apiKey": "apiKey",
  "authDomain": "judge-prefs-pfd.firebaseapp.com",
  "databaseURL": "https://judge-prefs-pfd.firebaseio.com/",
  "storageBucket": "judge-prefs-pfd.appspot.com"
}

firebase = pyrebase.initialize_app(config) #initializes app

db = firebase.database() #sets db as database variable

for upload in db.child('user_uploads').get().each(): #iterates over database of user uploads

    new = {} #initializes new judge dictionary
    newcomments = {} #initializes judge comments dictionary
    fullName = upload.val()['fullName'] #sets full name variable based on upload

    jid = "doesnotexist" #assigns that judge does not exist
    for jud in db.child('judges').order_by_child('fullName').equal_to(fullName).get().each(): #finds matching judge
        jid = jud.key() #assigns judge key to jid variable

    if (jid != "doesnotexist"): #only processes if judge exists

        jold = firebase.database().child('judges').child(jid).get() #downloads judge

        if (upload.val()['comments'] != "-1"):
            newcomments['fullName'] = fullName #creates name for new judge
            newcomments['comments'] = upload.val()['comments'] #adds comments
            ts = time.time() #does something
            newcomments['timestamp'] = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') #timestamps comment
            db.child('comments').push(newcomments) #updates comments

        new['fullName'] = fullName #creates fields for new judge
        new['phil'] = jold.val()['phil']
        new['rating'] = jold.val()['rating'] + int(upload.val()['rating'])
        new['speed'] = jold.val()['speed'] + int(upload.val()['speed'])
        new['numReviews'] = jold.val()['numReviews'] + 1

        if (upload.val()['winner'] == "pro"):
            new['aff_wr'] = jold.val()['aff_wr'] + 1

        new['extinction'] = {}
        new['theory'] = {}
        new['kritiks'] = {}
        new['rebuttal'] = {}

        if (upload.val()['extinction'] == "yes"):
            new['extinction']['yes'] = jold.val()['extinction']['yes'] + 1
            new['extinction']['no'] = jold.val()['extinction']['no']
            new['extinction']['idk'] = jold.val()['extinction']['idk']
        elif (upload.val()['extinction'] == "no"):
            new['extinction']['no'] = jold.val()['extinction']['no'] + 1
            new['extinction']['yes'] = jold.val()['extinction']['yes']
            new['extinction']['idk'] = jold.val()['extinction']['idk']
        elif (upload.val()['extinction'] == "idk"):
            new['extinction']['idk'] = jold.val()['extinction']['idk'] + 1
            new['extinction']['no'] = jold.val()['extinction']['no']
            new['extinction']['yes'] = jold.val()['extinction']['yes']

        if (upload.val()['kritiks'] == "yes"):
            new['kritiks']['yes'] = jold.val()['kritiks']['yes'] + 1
            new['kritiks']['no'] = jold.val()['kritiks']['no']
            new['kritiks']['idk'] = jold.val()['kritiks']['idk']
        elif (upload.val()['kritiks'] == "no"):
            new['kritiks']['no'] = jold.val()['kritiks']['no'] + 1
            new['kritiks']['yes'] = jold.val()['kritiks']['yes']
            new['kritiks']['idk'] = jold.val()['kritiks']['idk']
        elif (upload.val()['kritiks'] == "idk"):
            new['kritiks']['idk'] = jold.val()['kritiks']['idk'] + 1
            new['kritiks']['yes'] = jold.val()['kritiks']['yes']
            new['kritiks']['no'] = jold.val()['kritiks']['no']

        if (upload.val()['theory'] == "yes"):
            new['theory']['yes'] = jold.val()['theory']['yes'] + 1
            new['theory']['no'] = jold.val()['theory']['no']
            new['theory']['idk'] = jold.val()['theory']['idk']
        elif (upload.val()['theory'] == "no"):
            new['theory']['no'] = jold.val()['theory']['no'] + 1
            new['theory']['yes'] = jold.val()['theory']['yes']
            new['theory']['idk'] = jold.val()['theory']['idk']
        elif (upload.val()['theory'] == "idk"):
            new['theory']['idk'] = jold.val()['theory']['idk'] + 1
            new['theory']['no'] = jold.val()['theory']['no']
            new['theory']['yes'] = jold.val()['theory']['yes']

        if (upload.val()['rebuttal'] == "yes"):
            new['rebuttal']['yes'] = jold.val()['rebuttal']['yes'] + 1
            new['rebuttal']['no'] = jold.val()['rebuttal']['no']
            new['rebuttal']['idk'] = jold.val()['rebuttal']['idk']
        elif (upload.val()['rebuttal'] == "no"):
            new['rebuttal']['no'] = jold.val()['rebuttal']['no'] + 1
            new['rebuttal']['yes'] = jold.val()['rebuttal']['yes']
            new['rebuttal']['idk'] = jold.val()['rebuttal']['idk']
        elif (upload.val()['rebuttal'] == "idk"):
            new['rebuttal']['idk'] = jold.val()['rebuttal']['idk'] + 1
            new['rebuttal']['no'] = jold.val()['rebuttal']['no']
            new['rebuttal']['yes'] = jold.val()['rebuttal']['yes']

        db.child('judges').child(jid).update(new) #updates judge database
    db.child('user_uploads').child(upload.key()).remove() #removes judge from user uploads
