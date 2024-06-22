import React, {Fragment, useEffect, useState} from "react";
import Navbar from "../../components/navbar/navbar";
import "./Rent.css"
import {api, getApartmentTypes, getGroupApartmentType} from "../../services/Api";
import {useDropzone} from 'react-dropzone';
import {useSelector} from "react-redux";
import {NotAuth} from "../../components/Auth/NotAuth";


export default function Rent() {
    const {isLoggedIn, userId, token, refreshToken} = useSelector(
        (state) => state.auth);
    const [groupApartmentType, setGroupApartmentType] = useState([]);
    const [apartmentType, setApartmentType] = useState([]);
    const [radioValue, setRadioValue] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [stepRent, setStepRent] = useState(1)
    const [selectedStreetType, setStreetType] = useState("")
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userCity, setUserCity] = useState([]);
    const [streetName, setStreetName] = useState("");
    const [numberHouse, setNumberHouse] = useState("");
    const [numberCorpus, setNumberCorpus] = useState("");
    const [loadedFiles, setLoadedFiles] = useState([]);
    const onDrop = (acceptedFiles) => {

        acceptedFiles.forEach((file) => {
            console.log(file.name);
            setLoadedFiles([...loadedFiles, file.name]);
        });
    }

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    const handleStreetName = (e) => {
        setStreetName(e.target.value)
    }

    const handleNumberHouse = (e) => {
        setNumberHouse(e.target.value)
    }

    const handleNumberCorpus = (e) => {
        setNumberCorpus(e.target.value)
    }


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

    const selectApartmentType = (type) => {
        setRadioValue(type.id)
    }

    const handleSelectStreetType = (e) => {
        setStreetType(e.target.value)
    }

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

    return (
        <Fragment>
            <Navbar/>
            {!isLoggedIn && <NotAuth/>}
            {isLoggedIn && stepRent === 1 &&
                <div className="container">
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
                                        <input type='radio' value={type.id} checked={radioValue === type.id}
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
                                       value={searchTerm} onChange={fetchCity} onFocus={handleSearchFocus}
                                       onBlur={handleSearchBlur}/>
                                <div
                                    className={isSearchFocused ? "col-6 search-result-focused" : "col-6 search-result-normal"}>
                                    <ul>
                                        {userCity.map(result => (
                                            <li key={result.id}><span>{result.name}</span></li>
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
                        <div className={"col address-block"}><h5><strong>Адрес</strong></h5></div>
                    </div>
                    <div className="row">
                        <div className={"col-3"}></div>
                        <div className="col-6 address-block-form">
                            <label className="form-label mt-4">Тип улицы</label>
                            <select className="form-select" value={selectedStreetType}
                                    onChange={handleSelectStreetType}>
                                <option>Улица</option>
                                <option>Бульвар</option>
                                <option>Переулок</option>
                                <option>Проспект</option>
                                <option>Другое</option>
                            </select>
                            <label className={"form-label mt-2"}>Название улицы</label>
                            <input type="text" value={streetName} className="form-control"
                                   onChange={handleStreetName}/>
                            <label className={"form-label mt-2"}>Дом</label>
                            <input type="text" value={numberHouse} className="form-control"
                                   onChange={handleNumberHouse}/>
                            <label className={"form-label mt-2"}>Корпус</label>
                            <input type="text" value={numberCorpus} className="form-control"
                                   onChange={handleNumberCorpus}/>
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
                        <div className={"col-6 load-apart-photo"}>
                            <h3>Загрузите фото своих апартаментов</h3>
                            <div>
                                <p className="form-label mt-4">
                                    Помните, что первое фото будут видеть ваши гости при поиске жилья.
                                </p>
                                {/*<input className="form-control" type="file"/>*/}
                                <div {...getRootProps()} style={dropzoneStyles}>
                                    <input {...getInputProps()} />
                                    <p>Перетащите сюда файлы или кликните, чтобы выбрать</p>
                                </div>
                                {loadedFiles.map(f => (
                                    <div>{f.name}</div>
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
        </Fragment>
    );
}