import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { stringToHash, varifyHash, } from "bcrypt-inzi"
import fs from 'fs';
import multer from 'multer';
import admin from "firebase-admin";
import Stripe from 'stripe'


const serviceAccount = {
    "type": "service_account",
    "project_id": "my-product-app-react",
    "private_key_id": "57df2347efd6c9aa1050c9307f9ec343327e71bb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaNluLFBghkIfL\nLJ0UQEiz6iYzJryNkNejq6BHn8aGmPLN6pbe0nKCKyDU4wuw6ABnCaEaeLGBIGel\n11ccjcHk20efx41VcgnEKTFh+ZvLDJ6gvNRysF6hInH3zP3CO80++rQKoyEdQygy\n2NPeJJ8ig9lzwDmv8ZmdTW3nfqba3N5bYt5ehGOvzwglAgAxX6GwlLtohBaswsF5\niggXxbKP5qu1neyFq09Z1W8TddY9o1Pq/7dWGFac5TYEcHAhOLIFcxj8xW5W8x2/\nMYNxykEE2xtlJkft56YnARXFjjZttuqnySy7CWlGAu4ha0RrsXmpsTrkYlGUL2GW\nn9cqPg7zAgMBAAECggEAEqaZvXHqvBev25hFFsGF1Ubam/2gGRN7suQM74JDBCcX\nfa0i1wmyuth31mpPif/SZPwoNmyBc3FzGnQk4G5nV6m8XfY+6MI1/nus2lxsyfaa\nqk9pcyIK/IfGqPDu8YaN/OeNsukNgARI78ujlDWaGmedkuynoZerUwwWrDYhicw1\nkzhoH4sNbZRNvrFmCHD+3DEsK67fbnGRZ3qw0iyfRXz83m/+klNai19HgTkNyUmj\n2z7Nomvi0xjlTMdKnIODvWLs/CV0E6mKHHGCP5q/f2Bx5oDJp4jn+EmZQCGoX1rZ\nyUygpfKm5hIlvPJm4ufwIe57Rc/1uLEtmrV/ICCQUQKBgQDzoLInjq9BZSVN7/ar\nVjS9/Ukb4EZhw/o7Eutl4xcPULgHP5sUTN0CFMRlITf4fGRSMTMcTRj7F1e1MV31\npXT2c1WJPgI+Lirzs8tnzpyNHq+90v8aU4rNpa0kwkn69+ihYYob2l9RiMOgBlNf\ncb5ZIQJCBiKp91sYDhSFNrpecQKBgQDlSz8m1HDAL6pUXEAD/mExSzr4ltdCo8Xz\nJY73iaUWo7EmsT9I//qR+PU2QRkNhU+ucGT7Ua+HE5WqbaHfp2Gk/5wpe8n29TmE\nAoEb7ebKlZ9GrTM2oyJ752xSXtWzohS05VbPf1QFGwC/a3Q4Xlefxj0qKs/R/ot4\nZ+5jCcM9owKBgE3+sypQ1rCT5gZ2fTzLA2WTkfU3rrCb4h9JZk0fD4HasJ+5cDdm\niBajeWB66wVFJYTetWMpF4dDKNQcMt1yk+hWchrW3Db15tBQTh00mw/etBqMUxkl\nh7lggfbTsIWFGleX93QFTCC5LQ+tFsHmky7Lj4J9nllVlDc2QsGHDNExAoGBALCW\n8A8Oo7tPumV4GpE400+secFEIoqfKO+m6GF6L5us+90puuyUwDy1uNxM7Gd+WSym\nQQ9RDNcB3U1BW96swUXa2kEUpim9GMuzRg3lfc5dxyoecAfPQdqdE86oXPsYg8wB\nqIbrsCCyeDP0JLDY77EMcsTL7fvzhyR3HqBFv4jzAoGBAOFOnLn3CBwf7Buyfq9m\nxDhVVNdI2qokdsJqLrnq3PzQnkDAAVg8aCa4IGUrBYaKZR41za3zGEdOXUKlQa0L\n9OkShqw11+BYlolCDdL44SMyYn91DSqffP4hUXKqMr1TjzIcBrXL39q2oA5aS8hY\ndCfOBEjA8t73pguAp/tRLyo7\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xvskv@my-product-app-react.iam.gserviceaccount.com",
    "client_id": "115991785626513925649",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xvskv%40my-product-app-react.iam.gserviceaccount.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://my-product-app-react.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://my-product-app-react.appspot.com");
// const PUBLISHABLE_KEY = "pk_test_51LyAG3FNaO2pyCZjBH1FWkvQqTWRnE5fJ2hh38e4dxiVUC85DeFGtdLmXdatrZq2XpDTLyPpdq0HFGX8lq8U63Uf00supvSUGV"
// const SECRET_KEY = "sk_test_51LyAG3FNaO2pyCZj2ZeL0ZY6bWqmKhIkmNIHPtpy4yo5IWpyoEWtjyeqP5NN7hqsQykXugUdnQDNKUg1nA3tJ6FI00zrGM36UW"


const storageConfig = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storageConfig })



let dbURI = process.env.MONGODBURI || 'mongodb+srv://abc:abc@cluster0.jqfzaar.mongodb.net/eCommerceCRUD?retryWrites=true&w=majority';
const SECRET = process.env.SECRET || "topsecret";
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000', 'https://my-product-app-react.web.app', '*'],
    credentials: true
}));



const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model('user', userSchema);

const productSchema = new mongoose.Schema({
    productPicture: { type: String, required: true },
    title: { type: String, },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    count: { type: Number },

});
const productModel = mongoose.model('products', productSchema);


const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    id: { type: String },
    cartItems: [productSchema],
    amount: { type: String, required: true },
    createdBy: { type: String, },
    date_added: { type: Date, default: Date.now }
})

const OrderModel = mongoose.model('order', OrderSchema);


app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
        || !body.address
        || !body.gender
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                     "address": "korangi no 1"
                     "gender": "Male"
                }`
        );
        return;
    }




    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400).send({ message: "user already exist, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email.toLowerCase(),
                        password: hashString,
                        address: body.address,
                        gender: body.gender,
                    });
                    (err, result) => {
                        if (!err) {
                            console.log("data saved: ", result);
                            res.status(201).send({ message: "user is created" });
                        } else {
                            console.log("db error: ", err);
                            res.status(500).send({ message: "internal server error" });
                        }
                    };
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
        }
    })
});

app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    userModel.findOne({ email: body.email },
        "email firstName lastName address gender password",
        (err, user) => {
            if (!err) {
                console.log("user: ", user);

                if (user) { // user found

                    varifyHash(body.password, user.password).then(isMatched => {

                        if (isMatched) {
                            var token = jwt.sign({
                                _id: user._id,
                                email: user.email,
                                iat: Math.floor(Date.now() / 1000) - 30,

                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token:", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true
                            });

                            res.send({
                                message: "Login successful",
                                profile: {
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    address: user.address,
                                    gender: user.gender,
                                    _id: user._id

                                }


                            });

                            return;
                        } else {

                            console.log("user not found: ");
                            res.status(401).send({ message: "Incorrect email.or password," });
                            return;

                        }
                    })


                } else { // user not found

                    console.log("user not found: ",);
                    res.status(401).send({ message: "Incorrect email.or password," });
                    return;



                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "Login failed please try later" });
            }
        })
});

app.get("/products", async (req, res) => {

    try {
        const products = await productModel.find({}).exec();
        console.log("all product: ", products);

        res.send({
            message: "all products",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to get product"
        });
    }
})

const stripe = new Stripe('sk_test_51LyAG3FNaO2pyCZj2ZeL0ZY6bWqmKhIkmNIHPtpy4yo5IWpyoEWtjyeqP5NN7hqsQykXugUdnQDNKUg1nA3tJ6FI00zrGM36UW')

app.post("/create-checkout-session", async (req, res) => {


    const { id, amount, createdBy } = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "success",
            payment_method: id,
            confirm: true,
            metadata: {
                createdBy
            }
        });
        console.log(createdBy, "createdBy==");

        console.log(payment);

        const neworder = new OrderModel({

            id: req.body.id,
            cartItems: req.body.cartItems,
            amount: req.body.amount,
            createdBy: req.body.createdBy,
            date_added: req.body.date_added
        })
        neworder.save(function (err, result) {
            console.log(err);
            console.log(result);
        })

        return res.status(200).json({
            // alert=('you bought success'),
            confirm: "success"
        })
    }
    catch (error) {
        // console.log(error, "naya")
        return res.status(400).json({
            message: error.message,
        })

    }
});


app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {
                console.log("token approved");
                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/orderlist", async (req, res) => {

    try {
        const orderlist = await OrderModel.find({}).exec();
        res.send({
            message: "all oderList",
            data: orderlist
        });

    } catch (error) {
        console.log("error", error)
        res.status(500).send({ message: "error getting orders" });
    }
})

app.put("/profile/:id", async (req, res) => {
    console.log("profile to be edited: ", req.body);

    const update = {}
    if (req.body.firstName) update.firstName = req.body.firstName
    if (req.body.lastName) update.lastName = req.body.lastName
    if (req.body.gender) update.gender = req.body.gender
    if (req.body.address) update.address = req.body.address

    try {
        const updated = await userModel.findOneAndUpdate({ _id: req.params.id }, update, { new: true }
        ).exec();
        console.log("updated profile: ", updated);

        res.send({
            message: "profile updated successfuly",
            data: updated
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to upadate profile"
        });
    }
})


////////////////////////////////
app.get("/profile", async (req, res) => {

    try {
        let user = await userModel.findOne({ _id: req.body.token._id }).exec();
        res.send(user);

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})


app.post("/logout", (req, res) => {


    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true
    });

    res.send({ message: "Logout successful", });





});


app.get("/product/:id", async (req, res) => {

    try {
        const product = await productModel.findOne({ _id: req.params.id }).exec();
        console.log("product: ", product);

        res.send({
            message: "product",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to get product"
        });
    }
})


app.post("/product", upload.any(), async (req, res) => {


    console.log("prouct received: ", req.files);
    try {

        bucket.upload(
            req.files[0].path,
            {
                destination: `productPicture/${req.files[0].filename}`,
            },

            function (err, file, apiResponse) {
                if (!err) {

                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", req.body.createdBy)

                            const newProduct = new productModel({
                                productPicture: urlData[0],
                                title: req.body.title,
                                condition: req.body.condition,
                                description: req.body.description,
                                price: req.body.price,
                                createdBy: req.body.createdBy,
                            })

                            await newProduct.save()
                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                            res.send({
                                message: "product added",
                                data: "Product created successfully"
                            });
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send(err);
                }
            });


    } catch (error) {
        console.log('error', error)
        res.status(500).send({
            message: "faild to added product"
        });
    }
})

app.put("/product/:id", async (req, res) => {
    console.log("product to be edited: ", req.body);

    const update = {}
    if (req.body.productPicture) update.productPicture = req.body.productPicture
    if (req.body.title) update.title = req.body.title
    if (req.body.condition) update.condition = req.body.condition
    if (req.body.description) update.description = req.body.description
    if (req.body.price) update.price = req.body.price

    try {
        const updated = await productModel.findOneAndUpdate({ _id: req.params.id }, update, { new: true }
        ).exec();
        console.log("updated product: ", updated);

        res.send({
            message: "product updated successfuly",
            data: updated
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to upadate product"
        });
    }
})

app.delete("/product/:id", async (req, res) => {
    console.log("prouct delete: ", req.body);

    try {
        const deleted = await productModel.deleteOne({ _id: req.params.id });
        console.log("product deleted: ", deleted);

        res.send({
            message: "product deleted",
            data: deleted
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to delete product"
        });
    }
})



app.use((req, res) => {
    res.status(404).send('404 not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




// /////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////