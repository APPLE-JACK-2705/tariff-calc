import React, { useEffect, useRef, useState } from 'react';
import './design/HomePage.css';
import axios from 'axios';
import {useDownloadExcel} from 'react-export-table-to-excel';
import { useNavigate } from 'react-router-dom';

function HomePage({ onLogout }) {

  const tableRef = useRef(null);
  const {onDownload} = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Расчетные тарифные планы',
    sheet: 'Таблица расчетов'
  })
  const navigate = useNavigate();

  const [technologies, setTechnology] = useState([]);
  const [technologyOption,  setTechnologyOption] = useState('');
  const [services, setService] = useState([]); 
  const [portCount, setPortCount] = useState('');
  const [speed, setSpeed] = useState('');
  const [serviceOption, setServiceOption] = useState('');
  const [tableData, setTableData] = useState([]);

  const [speedDirty, setSpeedDirty] = useState(false);
  const [portCountDirty, setportCountDirty] = useState(false);

  const [speedError, setSpeedError] = useState('Обязатальное поле: скорость');
  const [portCountError, setportCountError] = useState('Обязатальное поле: кол-во портов');

  const [serviceError, setServiceError] = useState('Обязатальное поле: услуга');
  const [technologyError, setTechnologyError] = useState('Обязатальное поле: фильтр');

  const [serviceDirty, setServiceDirty] = useState(false);
  const [technologyDirty, setTechnologyDirty] = useState(false);
  
  const [formValid, setFormValid] = useState(false);
  
  useEffect(() => {
    axios.get("http://10.8.26.88/calc.php")
    .then(result => setTechnology(result.data))
    .catch(error => console.error('Не выбран фильтр:', error));
  }, []);

  useEffect(() => {
    if(technologyOption){
        axios.get('http://10.8.26.88/calc-services.php?technology_id=' + technologyOption)
        .then(result =>  setService(result.data))
        .catch(error => console.error('Не выбрана услуга:', error));
    }else{
        setService([]);
    }
  }, [technologyOption])

  useEffect(() => {
    if(speedError || portCountError || serviceError || technologyError){
        setFormValid(false);
    }else{
        setFormValid(true);
    }
  }, [speedError, portCountError, serviceError, technologyError])

  const blurHandler = (e) => {
    switch (e.target.name){
        case 'speed':
            setSpeedDirty(true)
            break
        case 'portCount':
            setportCountDirty(true)
            break
        case 'filter':
            setTechnologyDirty(true)
            break
        case 'serviceId':
            setServiceDirty(true)
            break
    }
  }

  const handleSpeed = (e) => {
    const value = e.target.name;
    setSpeed(value);
    if(!value){
        setSpeedError('Обязатальное поле: скорость');
    }else{
        setSpeedError('');
    }
  }

  const handlePortCount = (e) => {
    const value = e.target.value;
    setPortCount(value);
    if(!value){
        setportCountError('Обязатальное поле: кол-во портов');
    }else{
        setportCountError('');
    }
  }

  const handleServiceOption = (e) => {
    const value = e.target.value;
    setServiceOption(value);
    if(!value){
        setServiceError('Обязатальное поле: услуга');
    }else{
        setServiceError('');
    }
  }

  const handleTechnologySelect = (e) => {
    const value = e.target.value
    setTechnologyOption(value);
    if(!value){
        setTechnologyError('Обязатальное поле: фильтр');
    }else{
        setTechnologyError('');
    }
    setSpeed('');
    setPortCount('');
    setService([]);
    setTableData([]);
    setServiceError('Обязатальное поле: услуга');
    setSpeedError('Обязатальное поле: скорость');
    setportCountError('Обязатальное поле: кол-во портов');
  }

  function getResult(event) {
    event.preventDefault();
    const data = {
        serviceId: parseInt(serviceOption),
        speed: parseFloat(speed),
        portCount: parseInt(portCount)
    }
    axios.post("http://10.8.26.88/calc-tariff-plans.php", data)
    .then(response => setTableData(response.data)) 
    .catch(error => console.error("Не передались данные о расчете: " + error));  
  }

  const handleLogout = () => {
    onLogout();
    navigate('/calculator');
  }

  return (
    <div className="home-page">
        <div className="bottom">
            <div className="calculator">Калькулятор расчетных тарифных планов</div>
            <button className="logout-button" onClick={handleLogout}>Выйти</button>
        </div>
        <header>
            <div className="select-container">
                <label className="filter-label" for="filter_id">Фильтрация списка услуг:</label>
                <select id="filter_id" className="form-select" name="filter" onChange={handleTechnologySelect}>
                    <option value="" selected>Выберите фильтр</option>
                    {
                        technologies.map(technology => {
                            return <option value={technology.id}>{technology.name}</option>
                        })
                    }
                </select> 
            </div>
            {(technologyDirty && technologyError) && <span style={{color: 'red', fontSize: '13px'}}>{technologyError}</span>}
        </header>
        
        <form>
            <div className="select-container">
                <label className="service-label" for="service_id">Услуга:</label>
                <select id="service_id" onBlur={e => blurHandler(e)} className="form-select" name="serviceId" onChange={handleServiceOption}>
                    <option value="" selected>Выберите услугу</option>
                    {
                        services.map(service => {
                            return <option value={service.id}>{service.name}</option>
                        })
                    }
                </select>
            </div>
            {(serviceDirty && serviceError) && <span style={{color: 'red', fontSize: '13px'}}>{serviceError}</span>}
        

            <div className="input-form-container">
                <div className="input-form">
                    <label className="input-label-speed" for="speed_id">Скорость (Мбит/с):</label>
                    <input id="speed_id" onBlur={e => blurHandler(e)} value={speed} className="speed-input" type='number' name="speed" onChange={handleSpeed}></input>
                </div>
                {(speedDirty && speedError) && <div style={{color: 'red', fontSize: '13px'}}>{speedError}</div>}
                <div className="input-form">   
                    <label className="input-label-port" for="portCount_id">Количество портов (шт):</label>
                    <input id="portCount_id" onBlur={e => blurHandler(e)} value={portCount} className="port-input" type='number' name="portCount" onChange={handlePortCount}></input>
                </div>
                {(portCountDirty && portCountError) && <div style={{color: 'red', fontSize: '13px'}}>{portCountError}</div>}
            </div>
        </form>
        <div className="submit-container">
            <input disabled={!formValid} className="calculate" type='submit' value="Рассчитать" onClick={getResult}/>
            <button disabled={!formValid} className='download-csv' onClick={onDownload}>Скачать Excel</button>
        </div>

        <table className="table" ref={tableRef}>
            <thead>
                <tr>
                    <th>Тарифный план</th>
                    <th>Количество портов (Шт.)</th>
                    <th>Стоимость, тг (без НДС)</th>
                    <th>Стоимость, тг (с НДС)</th>
                </tr>
            </thead>
            <tbody>
                {
                    tableData && tableData.map((item) => {
                        return (
                            <tr key={item.id}>
                                <th>{item.name}</th>
                                <th>{item.portCount}</th>
                                <th>{item.error === 'Error' ? item.message : item.price}</th>
                                <th>{item.priceNDS}</th>
                            </tr>  
                        )
                    })
                }
            </tbody>
        </table>
        <footer>
            <div className='img-container'>
                <p className='for-questions'>По вопросам:<br/>Адильханов Адиль,<br/>Департамент тарифов и продуктов ДКБ<br/>+7-747-038-01-44</p>
                <p className='img-text'>Применяются тарифы, указанные в Прейскурантах:<br/>-B2B Каз-7<br/>-B2B Каз-11</p>
            </div>
        </footer>
    </div>
  );
}

export default HomePage;
