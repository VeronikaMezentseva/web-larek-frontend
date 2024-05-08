import './scss/styles.scss';
import { Presenter } from './components/Presenter';
import { CardsState } from './components/CardsState';

const state = new CardsState();
const presenter = new Presenter(state);

presenter.init();
