const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
   name:{
    type:String,
    required: true,
   },
   email:{
    type:String,
    required: true,
    unique: true,
   },
   password:{
    type:String,
    required: true,
   },
   pic:{
    type:String,
    default:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHcAdwMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwECB//EADcQAAICAQICBAwEBwAAAAAAAAABAgMEBRExQRIhUXEGExQiI0JSYYGR0eFzobHxFTI0NVRy8P/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9xAAAAAADzcD0Ea3UMSrfxmRWmuXS3Zy/i+B/kx+T+gE4EerNxbntXkVyb5KS3JAAAAAAAAAAAAA+oN7GY1nVpZEpY+NLaldUpL1/sBO1DXa6W68RK2a4yf8AKvqUOTm5OU/T2ykvZ32XyOAAAAASsXUcrFforX0fYl1oigDVadrNOU1Xd6K18nwl3MtDAl/omrNyji5Ut9+qub/RgX4AAAAAAGBTeEWc6aljVvadi3k+yP3M0d87IeVl23cpS83u5HAAASMDFlmZCrj1R4yl2IDhCErJKNcZSk+UVuzv5Bl7b+TWbf6mnx8erGrUKYKK/N951Axck4txkmmuKa2YNZmYdWXW42x6+UlxRl8mieNfOqzjF/NdoHMAAazRM55mL0bHvbX1S9/YyyMhomR5PqNe782zzJfHh+exrwAAAEbUrPFYGRNPZqD27ySQdb/teR3L9UBjwAAL/wAHq0sWyzbrlPb4Jfcz5eeD9+1NlPNS6S7gLkHx0+PUe9JvkB9FJ4R1pSpt4Npxfw/ct292m1wKTwgv6dtVXOCbfx/YCqB4egE3FqUeK60byuSnXGa4SSZgnwZucP8ApKPw4/oB2AAAj59buwr60t3KDS79iQAMAj0lanjPFzra/V36Ue5kUAdMa+zHujbU9pL8/cc0nJpRTbfBIuMPRJSSnlycV7EePxYFhh6lj5SS6ahZzhN7fLtJnLd9RWX6JjWL0TlU+/dP5kdaDLh5Stvw/uBLztVpx4uNUlbbyUXul3sztk5W2SssfSnJ7t9poKtFxIQas6dknzb227tiDm6NZSnPGbshzjt5y+oFUegAewi7JxhHjJqK+JvIRUYqK4JbGU0DG8fnxm15tXnPv5f97jWAAAAAAFXruA8rH8bWt7a+CXrLmjKm+Kq/R63nwyq9lFPpSr24vk0Bx0jT1jVq61emkuD9RfUsQAAAAAACn1rT04yyqFtJddkVz95RxTlJRim23skuZtNt+oi6fo9eLkTvk1KW78WvYX1A7aTheRYqi9vGS65v39hOAAAAAAAAAA+J1qXuZycJIkACKCTsuwdGPYvkBGPtVyfuO+wA+YwUeB9AAAAAAAAAAAAAAAAAAAAAAAAAAAAB/9k='
   }
   
}, 
{
  timestamps: true,
});

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      next();
   }
   
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   });

userSchema.methods.matchPassword = async function (enteredPassword) {
   const salt = await bcrypt.genSalt(10);
   return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
