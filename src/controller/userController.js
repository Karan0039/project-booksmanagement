const userModel = require("../models/usermodel")

// const isValidParams = function(arr){
//     let params = ["name", "title", "phone", "email", "password"]
//     for(let keys of arr){
//         if(params.indexOf(keys) == -1) return false
//     }
//     if(arr.length == 6){
//         if(arr.indexOf("address") == -1) return false
//     }
//     return true
// }

const registerUser = async function (req, res) {
    try {
        let data = req.body
        let getPhone = await userModel.findOne({ phone: data.phone })
        let getEmail = await userModel.findOne({ email: data.email })

        // if(!isValidParams(Object.keys(req.body))) 
        // return res.status(400).send({status : false, message : "Invalid Params, there might be something that should not be there"})

        function isPresent(value) {
            if (!value || value.trim().length == 0)
                return true;
        }
        function badRequest() {
            let error = []
            if (Object.keys(req.body).length == 0)
                return "Oops, you forgot to fill data inside request body"

            //check if title is present
            if (isPresent(data.title))
                error.push("title is required")
            //check for enum values
            let arr = ["Mr", "Mrs", "Miss"]
            if (data.title && !arr.includes(data.title.trim()))
                error.push("title can only be Mr,Mrs or Miss")

            //checks if name is present
            if (isPresent(data.name))
                error.push("name is required")
            //checks for valid name
            if (data.name && !data.name.trim().match(/^[A-z]*$|^[A-z]+\s[A-z]*$/))
                error.push("enter valid name")

            //checks if phone is present or not
            if (isPresent(data.phone))
                error.push("phone is required")
            //checks for valid phone number
            function isValid(x, y) {
                if (isNaN(y))
                    return true;
                else if ((x[0] == 9 || x[0] == 8 || x[0] == 7 || x[0] == 6) && x.length == 10)
                    return false;
                else return true;
            }
            let y = parseInt(data.phone)
            let x = y.toString()
            if (data.phone.trim() && isValid(x, y))
                error.push("Enter valid mobile number")
            //check unique phone number
            if (getPhone)
                error.push("mobile number is already in use")

            //check if email is present
            if (isPresent(data.email))
                error.push("email is required")
            //validate email
            if (data.email && !data.email.trim().match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/))
                error.push("email is invalid")
            //check for duplicate email
            if (getEmail)
                error.push("email is already in use")

            //check if password is present
            if (isPresent(data.password))
                error.push("password is required")
            //checks password length
            if (data.password && (data.password.length < 8 || data.password.length > 15))
                error.push("password must have 8-15 characters")

            //check if address have valid pincode
            if (data.address.pincode && !data.address.pincode.trim().match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/))
                error.push("pincode is invalid")

            if (error.length > 0)
                return error;
        }
        if (badRequest()) {
            let err = badRequest();
            return res.status(400).send({ status: false, msg: err })
        }

        let created = await userModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.registerUser = registerUser