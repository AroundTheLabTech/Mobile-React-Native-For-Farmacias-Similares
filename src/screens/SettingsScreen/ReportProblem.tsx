import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import ReportProblemStyles from './style/ReportProblemStyles';
import { useAuth } from '../../AuthContext';
import { postReportProblem } from '../../services/backend';

const ReportProblem = ({ navigation }) => {

  const { uid } = useAuth();

  const [orientation, setOrientation] = useState('portrait');

  const [issue, setIssue] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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

  async function handleProblemReport() {
    if (!issue.trim() || !description.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await postReportProblem(uid, issue, description);
      if (response && response.message) {
        Alert.alert('Éxito', response.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error al enviar el reporte.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo enviar el reporte. Inténtalo más tarde.');
    }
  }

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
            <TextInput style={ReportProblemStyles.formInput} onChangeText={(e) => setIssue(e)} />
          </View>
          <View style={ReportProblemStyles.containerInput} >
            <Text style={ReportProblemStyles.formLabel}  >Descripcion</Text>
            <TextInput
              style={ReportProblemStyles.formTextArea}
              multiline={true}
              numberOfLines={5}
              placeholder="Escribe aquí tu texto..."
              onChangeText={(e) => setDescription(e)}
            />
          </View>
        </View>
        <View style={ReportProblemStyles.containerSave} >
          <TouchableOpacity style={ReportProblemStyles.containerButtonSave} onPress={handleProblemReport} >
            <Text style={ReportProblemStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportProblem;
