import firebase from 'firebase/app';
import { fireStore } from '../firebase';
import { message } from 'antd';

export function NewMemberFunction(values) {
    let email = values.email
    let password = values.password
    let name = values.name
    let admin = values.admin
    let dbKey = values.dbKey

    
    var config = {
        apiKey: "AIzaSyDWJO3RMqjA8mS_pFkf7ZdG8ODYpwsBCZk",
        authDomain: "ledger-app-edfa5.firebaseapp.com",
        databaseURL: "https://ledger-app-edfa5.firebaseio.com",
    };
    var secondaryApp = firebase.initializeApp(config, Date.now().toString());
    const promise = secondaryApp.auth().createUserWithEmailAndPassword(email, password).then( async (newMember) => {

        if (newMember) {
            newMember.user.updateProfile({
                displayName: name
            })
        }

        let newUid = secondaryApp.auth().currentUser.uid
        secondaryApp.auth().signOut();

        fireStore.collection("Teams").doc(dbKey).set({
            'uids': firebase.firestore.FieldValue.arrayUnion(newUid)
            , 'members' : {[newUid] : {
                name: name,
                uid: newUid,
                email: email,
                admin: admin,
            }}
        }, {merge: true});
        message.success(name + "'s account has been created.")

        fireStore.collection("Teams").doc(dbKey).get().then((doc) => {
            doc.data().qualifications.map((item) => {
                fireStore.collection("Teams").doc(dbKey).set({
                    members: {
                        [newUid] : { [item.uid] : {
                            [item.qualification]: null
                            }
                        }
                    }
                }, {merge: true})
            })
        })
    })
    promise.catch(function (e) {
        if (e) {
            message.error(e.message)
            secondaryApp.auth().signOut();
        }
    });
}