import express from "express";
import cors from "cors";
// import pool from "./DB/db.js";
import isPhonetic from "./phonetic_algo/isPhonetic.js";
import isDisallowed from "./Disallowed/isDisallowed.js";
import isExist from "./DB/alreadyExist.js";
import createUser from "./DB/createUser.js";
import checkValues from "./checkData/checkData.js";

const app = express();
const PORT = process.env.PORT || 4000;

//middlwar
app.use(express.json());
app.use(cors());

app.post("/api/submit", async (req, res) => {
    const formdata = req.body;
    const is_exist = await isExist(formdata.newsTitle);
    console.log(formdata);
    console.log(is_exist.message);

    const checkDataResult = checkValues(formdata);

    if (checkDataResult.value == false) {
        console.log("hello", checkDataResult.message);
        res.status(200).json({ message: `${checkDataResult.message}` });
    }

    //check if the user's title is already exist or not
    if (is_exist.found && checkDataResult.value) {
        console.log("is_exist", is_exist.message);
        console.log(checkDataResult.message);
        res.status(200).json({ message: `${is_exist.message}` });
    } else if (!is_exist.found) {
        try {
            // step 1:- First check for disallowed words
            const disallowed = await isDisallowed(formdata.newsTitle);
            if (disallowed.found == true) {
                console.log(disallowed.message);
                res.status(200).json({ message: `${disallowed.message}` });
            } else if (disallowed.found == false) {
                //If there is no any disallowed words in user's title then
                // go for similar sound algo
                const result = await isPhonetic(formdata.newsTitle);
                if (result.prob > 0.25) {
                    res.status(200).json({
                        message: `There is similar sounding title and that is  ${result.message}`,
                    });
                } else {
                    // console.log(result.message);
                    // res.status(200).json({ message: `${result.message}` });
                    try {
                        const appendData = await createUser(formdata);
                        console.log(appendData);
                        res.status(200).json({ message: appendData });
                    } catch (err) {
                        console.log("error while inserting in DB", err);
                        res.status(500).json({ message: "server error" });
                    }
                }
            }
        } catch (err) {
            console.log("Error in /api/submit:", err);
            res.status(500).json({ message: "server error" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
