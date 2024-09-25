import { View, Text, SafeAreaView, Image, TextInput, Button, TouchableOpacity, FlatList, ActivityIndicator, Alert  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { addUser, deleteUser, getUser, updateUser } from '../api/UserManagements';
import { User } from '../types/User';
import { IconButton } from 'react-native-paper';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>();
  const [error, setError] = useState({name:'', email: '', age:''});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  useEffect(() =>{
    fetchUsers();
  },[]);
  const fetchUsers = async() => {
    setLoading(true);
    try{
      const fetchUsers = await getUser();
      setUsers(fetchUsers);
    }catch(err){
      console.error('lỗi loading',err);
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng. Vui lòng thử lại');
    }finally{
      setLoading(false);
    }
  };
  const handleAddUser = async() => {
    let check = true;
    const newUser = {name:'', email: '', age:''};
    if(!name){
      newUser.name = 'Name is required';
      check = false;
    }
    if(!email){
      newUser.email = 'Email is required';
      check = false;
    }else if(!/\S+@\S+\.\S+/.test(email)){
      newUser.email = 'Invalid email format';
      check = false;
    }
    // Kiểm tra giá trị tuổi
    if (!age) {
      newUser.age = 'Age is required';
      check = false;
    } else if (typeof age === 'number' && (age < 0 || age > 100)) {
      newUser.age = 'Age must be between 0 and 100';
      check = false;
    }
    if(!check){
      setError(newUser);
      return;
    }
    setLoading(true);
    try {
      const success = await addUser(name, email, age);
      if(success) {
        Alert.alert('thông báo', 'thêm thành công');
        setName('');
        setEmail('');
        setAge(0);
        setError({name:'', email: '', age:''});
        fetchUsers();
      }else{
        Alert.alert('thông báo', 'thêm thất bại');
      }
    } catch (error) {
      console.error('lỗi thêm người dùng:', error);
      Alert.alert('Lỗi', 'Không thể thêm người dùng. thử lại sau.');
    }finally{
      setLoading(false);
    }

  };
  const handleDeleteUser = async(id:string) => {
    setLoading(true);
    try {
      const success = await deleteUser(id);
      if(success) {
        Alert.alert('thông báo', 'xóa thành công');
        fetchUsers();
      }else {
        Alert.alert('thông báo', 'xóa thất bại');
      }
    } catch (error) {
      console.error('Lỗi xóa người dùng:', error);
      Alert.alert('Lỗi', 'Không thể xóa người dùng. thử lại sau.');
    }finally{
      setLoading(false);
    }
  }
  const handleEditUser = (user:User) => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setSelectedUserId(user.id);
    setEditMode(true);
  };
  const handleUpdateUser = async() => {
    let check = true;
    const newUser = {name:'', email: '', age:''};
    if(!name){
      newUser.name = 'Name is required';
      check = false;
    }
    if(!email){
      newUser.email = 'Email is required';
      check = false;
    }else if(!/\S+@\S+\.\S+/.test(email)){
      newUser.email = 'Invalid email format';
      check = false;
    }
    if (!age) {
      newUser.age = 'Age is required';
      check = false;
    } else if (typeof age === 'number' && (age < 0 || age > 100)) {
      newUser.age = 'Age must be between 0 and 100';
      check = false;
    }
    if(!check){
      setError(newUser);
      return;
    }
    setLoading(true);
    try {
      const success = await updateUser(selectedUserId,name, email, age);
      if(success) {
        Alert.alert('thông báo', 'cập nhật thành công');
        setName('');
        setEmail('');
        setAge(0);
        setEditMode(false);
        setSelectedUserId(null);
        setError({name:'', email: '', age:''});
        fetchUsers();
      }else {
        Alert.alert('thông báo', 'cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi cập nhật người dùng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật người dùng. Vui lòng thử lại sau.');
    }finally{
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex mt-2">
        <View className='justify-center items-center mt-2'>
          <Text className='text-2xl font-bold text-black'>Quản lý người dùng</Text>
        </View>
      </SafeAreaView>
      <View className='flex-1 px-5 pt-5'>
        {/*name */}
        <Text className='ml-2 text-sm font-bold'>Name</Text>
        <TextInput
          className='border-2 border-blue-400 rounded-xl mb-2 text-base p-2'
          placeholder='Name'
          value={name}
          onChangeText={setName}
        />
        {error.name ? (
              <Text className="text-red-500 ml-2">{error.name}</Text>
          ) : null}
        {/*email */}
        <Text className='ml-2 text-sm font-bold'>Email</Text>
        <TextInput
          className='border-2 border-blue-400 rounded-xl mb-2 text-base p-2'
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
        {error.email ? (
              <Text className="text-red-500 ml-2">{error.email}</Text>
          ) : null}
        {/*age */}
        <Text className='ml-2 text-sm font-bold'>Age</Text>
        <TextInput
          className='border-2 border-blue-400 rounded-xl mb-2 text-base p-2'
          placeholder='Age'
          value={age?.toString()}
          keyboardType='numeric'
          onChangeText={text => {
            const cleanedText = text.replace(/[^0-9]/g, ''); 
            if (cleanedText === '') {
              setAge(undefined); // Đặt giá trị là undefined nếu không có số
            } else {
              setAge(Number(cleanedText)); // Cập nhật giá trị số
            }
          }}
        />
        {error.age ? (
              <Text className="text-red-500 ml-2">{error.age}</Text>
          ) : null}
        {/*button */}
        <TouchableOpacity 
          className='rounded-xl bg-blue-400 py-2 mt-2'
          onPress={editMode ? handleUpdateUser : handleAddUser}
          >
          {editMode ? 
          <Text className='text-base font-bold text-white text-center'>Lưu</Text> :
          <Text className='text-base font-bold text-white text-center'>Thêm mới</Text>}
        </TouchableOpacity>
        <View className='justify-center items-center mt-2'>
          <Text className='text-2xl font-bold text-black'>Danh sách</Text>
        </View>
        {/*list user */}
        {loading ? 
          (<ActivityIndicator size="large" color="#0000ff" />) :
          (<FlatList 
              data={users} 
              keyExtractor={(item) => item.id}
              renderItem={({item}) =>(
              <View className='flex-row justify-between items-center mt-3 bg-gray-200 py-2 px-3'>
                  <View className='flex-1'>
                    <Text className='flex-1 text-base text-black'>Tên: {item.name}</Text>
                    <Text className='flex-1 text-base text-black'>Email: {item.email}</Text>
                    <Text className='flex-1 text-base text-black'>Tuổi: {item.age}</Text>
                  </View>
                  <View className='flex-row'>
                    <IconButton icon="pencil" size={24} iconColor='green' onPress={() => handleEditUser(item)}/>
                    <IconButton icon='trash-can' size={24} iconColor='red' onPress={() => handleDeleteUser(item.id)}/>
                  </View>
              </View>
              )}
          />)}
      </View>
    </View>
  )
}