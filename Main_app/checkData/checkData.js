const checkValues = (data) => {
    if (
        data.username == "" &&
        data.newsTitle == "" &&
        data.state == "" &&
        data.city == "" &&
        data.periodicity == ""
    ) {
        return {
            message: `All fields are required`,
            value: true,
        };
    } else {
        return {
            message: `ok`,
            value: false,
        }
    }
};

export default checkValues;
