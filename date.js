
exports.gateDate = () => {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    return today.toLocaleDateString("en-US", options);
}

exports.gateDay = () => {
    const today = new Date();
    const options = {
        weekday: "long"
    };
    return today.toLocaleDateString("en-US", options);
}