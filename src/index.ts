import './scss/styles.scss';
import { Presenter } from './components/Presenter';
import { State } from './components/State';

const state = new State();
const presenter = new Presenter(state);

presenter.init();
