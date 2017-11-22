import Downshift       from 'downshift'
import { isFunction }  from 'helpers/common'
import Types           from 'helpers/types'
import SelectContainer from './select.container'
import Default         from 'helpers/default'

import './styles.scss'

export default class Select extends PureComponent {

  static propTypes = {
    options:             Types.funcOrArrayOf(Types.stringOrObject).isRequired,

    label:               Types.string,
    placeholder:         Types.string,
    optionStyle:         Types.funcOrObject,
    filter:              Types.funcOrBool,
    defaultSelectedItem: Types.func,

    onInputValueChange:  PropTypes.func,
  }

  static defaultProps = {
    label:               void 0,
    placeholder:         'Select item...',
    onInputValueChange:  Default.noop,
    defaultSelectedItem: null,

    optionStyle: ({ index, item, highlightedIndex, selectedItem }) => ({
      backgroundColor: highlightedIndex === index ? '#559cc9' : 'transparent',
      color:           highlightedIndex === index ? 'white' : 'inherit',
      fontWeight:      selectedItem     === item  ? 'bold' : 'normal'
    }),

    filter: false,
  }

  onInputValueChange = (inputValue, state) => {
    const { options, onInputValueChange } = this.props;
    if (isFunction(options)) {
      // TODO
      // this.props.options(inputValue);
    }

    // eslint-disable-next-line
    console.log('inputValue: ', inputValue);
    onInputValueChange(inputValue, state);
  }

  render() {
    const { filter, options, defaultSelectedItem, children } = this.props;

    // Runtime error
    // options();

    const inProps = {
      ...this.props,
      refKey:              'containerKey',
      onInputValueChange:  this.onInputValueChange,
      defaultSelectedItem: defaultSelectedItem || (!filter ? options[0] : void 0),
    };

    return (
      <Downshift { ...inProps }>
        { ({ getRootProps, ...outProps }) => {
          const props = getRootProps({
            ...inProps,
            ...outProps,
          });

          return (
            isFunction(children) ? children({ SelectContainer, ...props }) : <SelectContainer { ...props } />
          );
        } }
      </Downshift>
    );
  }
}