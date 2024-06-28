import React, {Fragment, useEffect, useState} from "react";
import Navbar from "../../components/navbar/navbar";
import "./Rent.css"
import {api, createApartment, getApartmentTypes, getGroupApartmentType} from "../../services/Api";
import {useDropzone} from 'react-dropzone';
import {useSelector, useDispatch} from "react-redux";
import {NotAuth} from "../../components/Auth/NotAuth";
import {showMessageInfo} from "../../Redux/messagesReducer";


export default function Rent() {
    const dispatch = useDispatch();
    const {isLoggedIn, userId, token, refreshToken} = useSelector(
        (state) => state.auth);
    const [groupApartmentType, setGroupApartmentType] = useState([]);
    const [apartmentType, setApartmentType] = useState([]);
    const [isHidden, setIsHidden] = useState(true);
    const [stepRent, setStepRent] = useState(1)
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userCity, setUserCity] = useState([]);
    const [loadedFiles, setLoadedFiles] = useState([]);
    const [apartData, setApartData] = React.useState({
        type: "",
        city: "",
        landlord: userId,
        images: [],
        name: "",
        street_name: "",
        number_house: "",
        number_block: "",
        sleeping_places: "",
        price: "",
        // numberHouse: "",
        // numberCorpus: "",
        // selectedStreetType: "",
        descriptions: "",
    });
    const [previewImages, setPreviewImages] = React.useState([]);

    const onDrop = (acceptedFiles) => {

        acceptedFiles.forEach((file) => {
            console.log(file.name);
            setLoadedFiles([...loadedFiles, file.name]);
        });
    }

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setApartData((prevState) => ({
            ...prevState,
            images: [...prevState.images, ...selectedFiles],
        }))

        const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevImages) => [...prevImages, ...imageUrls]);
    };

    const handleReset = () => {
        setApartData({images: []});
        setPreviewImages([]);
    };

    const submitApartData = async () => {
        const formDataToSend = new FormData();
        Object.entries(apartData).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((photo, index) => {
                    formDataToSend.append(`images[${index}]`, photo);
                });
            } else {
                formDataToSend.append(key, value);
            }
        });
        const response = await createApartment(formDataToSend);
        if (response.status === 201) {
            dispatch(
                showMessageInfo({type: "success", text: "Объявление создано"})
            );
            handleReset();
        } else {
            dispatch(
                showMessageInfo({
                    type: "error",
                    text: "Произошла ошибка при создании объявления",
                })
            );
        }
    }

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    const fetchCity = async (e) => {
        setSearchTerm(e.target.value);
        let response = {data: null}
        response = await api
            .get(`/api/city/search/?term=${e.target.value}`)
            .catch(err => console.log(err));
        if (response === undefined) {
            return;
        }
        setUserCity(response.data);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const handleClickOnGroupBlock = (group) => {
        fetchApartmentType(group.id);
        if (isHidden) {
            setIsHidden(false);
        }
    }

    const nextStep = () => {
        setStepRent(stepRent + 1)
    }

    const prevStep = () => {
        setStepRent(stepRent - 1)
    }

    const fetchApartmentType = async (id) => {
        try {
            const response = await getApartmentTypes(id);
            if (response.status === 200) {
                setApartmentType(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const fetchGroupApartmentTypes = async () => {
        try {
            const response = await getGroupApartmentType();
            if (response.status === 200) {
                setGroupApartmentType(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleChange = async (event) => {
        const {name, value} = event.target;
        setApartData((prev) => ({...prev, [name]: value}));
        if (searchTerm !== "") {
            setApartData((prev) => ({...prev, ["city"]: searchTerm}))
        }
    }

    const selectApartmentType = (type) => {
        setApartData((prev) => ({...prev, ["type"]: type.id}))
    }

    const handleSelectCity = (item) => {
        setSearchTerm(item)
        handleSearchBlur();
    };

    useEffect(() => {
        fetchGroupApartmentTypes();
    }, []);

    const dropzoneStyles = {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        margin: '20px auto',
        maxWidth: '400px',
    };

    const transitionBlock = {
        transition: "width 1s, height 1s",
    }

    return (
        <Fragment>
            <Navbar/>
            {!isLoggedIn && <NotAuth/>}
            {isLoggedIn && stepRent === 1 &&
                <div className="container" style={transitionBlock}>
                    <div className="row">
                        <div className="col rent-header">
                            <h3>Сдавайте своё жильё на ArendaBy</h3>
                            <p>Бесплатное размещение объявлений, оплата только за успешные бронирования</p>
                        </div>
                    </div>
                    <div className="row">
                        <h5>Что будете сдавать?</h5>
                        {groupApartmentType.map(group => (
                            <div className="col-lg-3"
                                 onClick={() => handleClickOnGroupBlock(group)}>
                                <div className="type-apartment">
                                    <p>{group.group_name}</p>
                                    <p className="inf">{group.short_info}</p>
                                </div>
                                <div className="footer-type-apartment">
                                    <span>{group.descriptions}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {apartmentType.map(type => (
                            <div className="col-3 ">
                                <div className="apart-type-block" onClick={() => selectApartmentType(type)}>
                                    <div className="my-radio-block">
                                        <input type='radio' value={type.id}
                                               checked={apartData.type === type.id}
                                               onChange={() => {
                                               }}/> {type.type_name}
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    {!isHidden && <div className="rent-city-block">
                        <div className="row">
                            <div className="col">
                                <h5>Укажите местоположение объекта:</h5>
                            </div>
                        </div>
                        <div className="row input-city">
                            <div className="col">
                                <span>Город</span>
                                <input className="form-control form-control-md city-search"
                                       type="Куда едем" placeholder="Курорт, город или адрес"
                                       name="city"
                                       value={searchTerm} onChange={fetchCity} onFocus={handleSearchFocus}
                                />
                                <div
                                    className={isSearchFocused ? "col-6 search-result-focused" : "col-6 search-result-normal"}>
                                    <ul>
                                        {userCity.map(result => (
                                            <li className={"search-city-item"}
                                                onClick={() => handleSelectCity(result.name)}>
                                                <span>{result.name}</span></li>
                                        ))}
                                    </ul>
                                </div>
                                {/*<input type="text" value={userCity} onChange={fetchUserCity}/>*/}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col btn-next">
                                <button type="button" className="btn btn-info" onClick={nextStep}>Продолжить
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            }
            {stepRent === 2 &&
                <div className="container">
                    <div className="row">
                        <div className={"col rent-header"}><h5><strong>Адрес</strong></h5></div>
                    </div>
                    <div className="row">
                        <div className={"col-3"}></div>
                        <div className="col-6 address-block-form">
                            <label className="form-label mt-4">Тип улицы</label>
                            <select className="form-select" name="selectedStreetType">
                                <option>Улица</option>
                                <option>Бульвар</option>
                                <option>Переулок</option>
                                <option>Проспект</option>
                                <option>Другое</option>
                            </select>
                            <label className={"form-label mt-2"}>Название улицы</label>
                            <input type="text" name="street_name" value={apartData.street_name} className="form-control"
                                   onChange={handleChange} required/>
                            <label className={"form-label mt-2"}>Дом</label>
                            <input type="text" name="number_house" value={apartData.number_house} className="form-control"/>
                            <label className={"form-label mt-2"}>Корпус</label>
                            <input type="text" name="number_block" value={apartData.number_block} className="form-control"/>
                        </div>
                        <div className={"col-3"}></div>
                    </div>
                    <div className="row">
                        <div className={"co-3"}></div>
                        <div className="col-6 btn-next">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>Назад</button>
                            <button type="button" className="btn btn-info" onClick={nextStep}>Продолжить</button>
                        </div>
                        <div className={"co-3"}></div>
                    </div>
                </div>
            }
            {stepRent === 3 &&
                <div className={"content"}>
                    <div className={"row"}>
                        <div className={"col-3"}></div>
                        <div className={"col-6 rent-header"}>
                            <h3>Загрузите фото своих апартаментов</h3>
                            <div>
                                <p className="form-label mt-4">
                                    Помните, что первое фото будут видеть ваши гости при поиске жилья.
                                </p>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleFileChange}
                                    required
                                />
                                {/*<input className="form-control" type="file"/>*/}
                                {/*<div {...getRootProps()} style={dropzoneStyles}>*/}
                                {/*    <input {...getInputProps()} />*/}
                                {/*    <p>Перетащите сюда файлы или кликните, чтобы выбрать</p>*/}
                                {/*</div>*/}
                                {/*{loadedFiles.map(f => (*/}
                                {/*    <div>{f.name}</div>*/}
                                {/*))}*/}
                            </div>
                            <div>
                                {previewImages.map((image, index) => (
                                    <>
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Preview ${index}`}
                                            style={{width: "200px", height: "200px"}}
                                            onClick={() =>
                                                setPreviewImages((prevImages) =>
                                                    prevImages.filter((_, i) => i !== index)
                                                )
                                            }
                                        />
                                    </>
                                ))}
                            </div>
                        </div>
                        <div className={"col-3"}></div>
                    </div>
                    <div className="col-6 btn-next">
                        <button type="button" className="btn btn-secondary" onClick={prevStep}>Назад</button>
                        <button type="button" className="btn btn-info" onClick={nextStep}>Продолжить</button>
                    </div>
                </div>
            }
            {stepRent === 4 &&
                <div className={"container"}>
                    <div className="row">
                        <div className={"col rent-header"}><h5><strong>Общие сведения</strong></h5></div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-3"}></div>
                        <div className={"col-6"}>
                            <label className={"form-label mt-2"}>Название апартаментов</label>
                            <input type="text" name="name" value={apartData.name} className="form-control"
                                   onChange={handleChange} required/>
                            <label className={"form-label mt-2"}>Количество спальных мест</label>
                            <input type="text" name="sleeping_places" value={apartData.sleeping_places}
                                   className="form-control"
                                   onChange={handleChange} required/>
                            <label className={"form-label mt-2"}>Цена за сутки</label>
                            <input type="text" name="price" value={apartData.price} className="form-control"
                                   onChange={handleChange} required/>
                            <label className={"form-label mt-2"}>Описание</label>
                            <textarea name="descriptions" value={apartData.descriptions} className="form-control"
                                      onChange={handleChange} required/>
                        </div>
                        <div className={"col-3"}></div>
                    </div>
                    <div className="col-6 btn-next">
                        <button type="button" className="btn btn-secondary" onClick={prevStep}>Назад</button>
                        <button type="button" className="btn btn-info" onClick={nextStep}>Продолжить</button>
                    </div>
                </div>
            }
            {stepRent === 5 &&
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col rent-header"}><h3><strong>Подтверждение данных</strong></h3></div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-3"}></div>
                        <div className={"col-6"}>
                            <p><strong>Тип апартаментов:</strong> {apartData.selectedApartType}</p>
                            <p><strong>Город:</strong> {apartData.city}</p>
                            <p><strong>Тип улицы:</strong> {apartData.selectedStreetType}</p>
                            <p><strong>Название улицы:</strong> {apartData.street_name}</p>
                            <p><strong>Номер дома:</strong> {apartData.number_house}</p>
                            <p><strong>Номер корпуса:</strong> {apartData.number_block}</p>
                            <p><strong>Арендадатель:</strong> {userId}</p>
                            <p><strong>Название:</strong> {apartData.name}</p>
                            <p><strong>Количество спальных мест:</strong> {apartData.sleeping_places}</p>
                            <p><strong>Цена за сутки:</strong> {apartData.price}</p>
                            <p><strong>Описание:</strong> {apartData.descriptions}</p>
                        </div>
                        <div className={"col-3"}></div>
                    </div>
                    <div className={"row"}>
                        <div className="col-6 btn-next">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>Назад</button>
                            <button type="button" className="btn btn-info" onClick={submitApartData}>Разместить</button>
                            {/*<button type="button" className="btn btn-info" onClick={nextStep}>Продолжить</button>*/}
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    );
}