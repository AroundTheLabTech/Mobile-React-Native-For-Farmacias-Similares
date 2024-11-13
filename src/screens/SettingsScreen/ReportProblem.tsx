import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import ReportProblemStyles from './style/ReportProblemStyles';

const ReportProblem = ({ navigation }) => {

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <ScrollView
      style={ReportProblemStyles.container}
      contentContainerStyle={orientation === 'portrait' ? ReportProblemStyles.container : ReportProblemStyles.containerMax}
    >
      <View style={ReportProblemStyles.containerSettings} >
        <TouchableOpacity style={ReportProblemStyles.containerGoBack} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <Text style={ReportProblemStyles.reportProblemTitle} >Reportar un problema</Text>
        <View style={ReportProblemStyles.containerForm}>
          <View style={ReportProblemStyles.containerInput} >
            <Text style={ReportProblemStyles.formLabel} >Asunto</Text>
            <TextInput style={ReportProblemStyles.formInput} />
          </View>
          <View style={ReportProblemStyles.containerInput} >
            <Text style={ReportProblemStyles.formLabel}  >Descripcion</Text>
            <TextInput
              style={ReportProblemStyles.formTextArea}
              multiline={true}
              numberOfLines={5}
              placeholder="Escribe aquí tu texto..."
            />
          </View>
        </View>
        <View style={ReportProblemStyles.containerSave} >
          <TouchableOpacity style={ReportProblemStyles.containerButtonSave} onPress={() => navigation.goBack()} >
            <Text style={ReportProblemStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
};

export default ReportProblem;
