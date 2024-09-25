import auth from './firebase'
import {dbuser} from './firebase'
import {collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore'

///ham them user
export const addUser = async(name, email, age) =>{
    try {
        const newU = {
            name,
            email,
            age
        };
        const userCollection = collection(dbuser, 'users');
        await addDoc(userCollection, newU);
        return true;
    } catch (error) {
        return false;
    }
};
///ham lay danh sanh
export const getUser = async () => {
    try {
        const userCollection = collection(dbuser, 'users');
        const userSnapshot = await getDocs(userCollection);
        return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        return [];
    }
};
//ham cap nhat
export const updateUser = async (id, name, email, age) =>{
     try {
        const updateInfo =  doc(dbuser, 'users', id);
        await updateDoc(updateInfo,{
            name,
            email,
            age,
        })
        return true;
     } catch (error) {
        return false;
     }
};
//hamm xoa user
export const deleteUser = async(id) => {
    try {
        const userRef = doc(dbuser, 'users', id);
        await deleteDoc(userRef);
        return true;
    } catch (error) {
        return false;
    }
};