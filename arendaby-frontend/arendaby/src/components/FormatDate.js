const FormatDate = ({dateString}) => {
    const date = new Date(dateString);

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const dateFormatter = new Intl.DateTimeFormat('ru-RU', options);
    return dateFormatter.format(date);
};

export default FormatDate;