import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { colors } from '../../../../global-class';

import OptionSelectStyle from './style/OptionSelectStyles';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface IOption {
  label: string
  value: string
}

interface IOptionSelect {
  options: IOption[];
  label?: string;
  defaultValue?: IOption;
}

const OptionSelect: React.FC<IOptionSelect> = ({ options, defaultValue = undefined, label = undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption>(defaultValue ? defaultValue : options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View style={OptionSelectStyle.container}>
      {
        label ?
          (
            <Text style={OptionSelectStyle.selectedText}>{label}</Text>
          ) : null
      }

      <TouchableOpacity onPress={toggleDropdown} style={OptionSelectStyle.dropdown}>
        <Text style={OptionSelectStyle.selectedText}>{selectedOption.label}</Text>
        {isOpen ?
          (
            <FontAwesomeIcon icon={faChevronUp} color={colors.third} />
          ) :
          (<FontAwesomeIcon icon={faChevronDown} color={colors.third} />)
        }

      </TouchableOpacity>

      {isOpen && (
        <View style={OptionSelectStyle.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => selectOption(option)} style={OptionSelectStyle.option}>
              <Text style={OptionSelectStyle.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


export default OptionSelect;
