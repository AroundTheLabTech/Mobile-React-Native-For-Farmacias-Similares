import { colors, fontSizes } from '../../../../../global-class';
import { StyleSheet } from 'react-native';

const OptionSelectStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
    zIndex: 1,
  },
  dropdown: {
    padding: 10,
    backgroundColor: colors.background3,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
  },
  selectedText: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    fontWeight: '700',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: colors.background3,
    borderWidth: 1,
    borderColor: colors.background3,
    borderRadius: 5,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default OptionSelectStyle;
