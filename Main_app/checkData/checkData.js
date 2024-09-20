const checkValues = (data) => {
    if (
        data.username == "" ||
        data.newsTitle == "" ||
        data.state == "" ||
        data.city == "" ||
        data.periodicity == ""
    ) {
        return {
            message: `All fields are required`,
            value: false,
        };
    } else {
        return {
            message: `ok`,
            value: true,
        }
    }
};

export default checkValues;
