import "dotenv/config"
import mongoose, { ConnectOptions, Schema, model } from "mongoose"
import { IdataRegister, IdbMessage } from "../../domain/model"
import bcrypt from "bcrypt"

const {
  MONGO_INITDB_ROOT_USERNAME: root,
  MONGO_INITDB_ROOT_PASSWORD: example,
} = process.env
// let uri = "mongodb://172.18.0.2"; //script Juanca
// let uri = "mongodb://172.23.0.3:27017"; //nicolokaNet, ip del Puerto del contenedor
// let uri = `mongodb://${root}:${example}@localhost:27017`; //El puerto viene predefinido en la imagen, de manera interna, si cambio da error!!
let uri = `mongodb://root:example@localhost:27017` //El puerto viene predefinido en la imagen, de manera interna, si cambio da error!!
// let uri = "mongodb://localhost:27017"; //Funciona!!

// mongoose.set("useNewUrlParser", true)
mongoose
  .connect(
    uri
    //   {
    //   user: "root",
    //   pass: "example",
    //   dbName: "sprint7",
    // }
  )
  .then(async () => {
    const allUser = await UserModel.find()
    console.log("Connected to MongoDB!")
    // console.log("AllUSers:", allUser)
    console.log("lastUser:", allUser.at(-1))
    console.log("count:", allUser.length)
  })
  .catch((err) => {
    console.log("error!!")
    throw err
  })

const saltRounds = 8

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  genere: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
})

UserSchema.pre("save", async function (next) {
  // const user = this

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password as string, saltRounds)
  }
  next()
})

const ChatSchema: Schema = new Schema({
  pair_writers: {
    type: String,
    required: true,
  },
  messages: [
    {
      writer: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
})

const UserModel = model<IdataRegister>("User", UserSchema)
const ChatModel = model<IdbMessage>("Chat", ChatSchema)

export { UserModel, ChatModel }
