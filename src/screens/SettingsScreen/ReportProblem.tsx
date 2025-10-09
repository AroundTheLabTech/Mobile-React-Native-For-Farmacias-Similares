import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import ReportProblemStyles from './style/ReportProblemStyles';
import { useAuth } from '../../AuthContext';
import { postReportProblem, getProblemReports } from '../../services/backend';
import { ProblemReport } from '../../types/report';
import AppMessage from '@components/AppMessage/AppMessage';
import { ToastState, ToastType } from 'src/types/toast';

const ReportProblem = ({ navigation }) => {

  const { uid } = useAuth();

  const [page, setPage] = useState('ReportProblem');

  const [orientation, setOrientation] = useState('portrait');

  const [issue, setIssue] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [reportedProblems, setReportedProblems] = useState<ProblemReport[]>([]);

  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: ToastType, text: string) => setToast({ type, text });

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

  useEffect(() => {
    async function fetchData() {
      const reports: ProblemReport[] = await getProblemReports(uid);

      reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      reports.forEach(report => {
        const date = new Date(report.created_at);
        report.created_at = date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      });

      setReportedProblems(reports);
    }

    fetchData();
  }, [uid]);

  async function handleProblemReport() {
    if (!issue.trim() || !description.trim()) {
      showMessage('error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await postReportProblem(uid, issue, description);
      if (response && response.message) {
        showMessage('success', response.message);
      } else {
        showMessage('info', 'Ocurrió un error al enviar el reporte.');
      }
    } catch (error) {
      console.error(error);
      showMessage('error', 'No se pudo enviar el reporte. Inténtalo más tarde');
    }
  }

  if (page === 'ReportProblemList') {
    return <ScrollView
      style={ReportProblemStyles.container}
      contentContainerStyle={orientation === 'portrait' ? ReportProblemStyles.container : ReportProblemStyles.containerMax}
    >
      <View style={{ flex: 1 }}>
        {/* AppMessage flotante */}
        {toast && (
          <AppMessage
            type={toast.type}
            message={toast.text}
            onHide={() => setToast(null)}
            duration={2500}
          />
        )}

        <View style={ReportProblemStyles.containerSettings} >
          <TouchableOpacity style={ReportProblemStyles.containerGoBack} onPress={() => setPage("ReportProblem")} >
            <FontAwesomeIcon icon={faArrowLeft} />
          </TouchableOpacity>
          <Text style={ReportProblemStyles.reportProblemTitle} >Lista de problemas reportados</Text>
          <View style={ReportProblemStyles.containerForm}>
            {/*
            Aquí se mostrarán los problemas reportados en formato de lista.
            Puedes mapear un array de problemas y mostrar los campos requeridos.
          */}
            {Array.isArray([]) && [].length === 0 && (
              <Text style={ReportProblemStyles.infoText}>No hay problemas reportados.</Text>
            )}
            {/* Reemplaza el array vacío [] por el array real de problemas cuando esté disponible */}
            {reportedProblems.map((problem, idx) => (
              <View key={idx} style={ReportProblemStyles.reportedProblemItem}>
                <Text style={ReportProblemStyles.reportedProblemDate}>
                  {problem.created_at}
                </Text>
                <Text style={ReportProblemStyles.reportedProblemIssue}>
                  {problem.issue}
                </Text>
                <Text style={ReportProblemStyles.reportedProblemDescription}>
                  {problem.description}
                </Text>
              </View>
            ))}
          </View>
          <View style={ReportProblemStyles.containerSave} >
            <TouchableOpacity style={ReportProblemStyles.containerButtonSave} onPress={handleProblemReport} >
              <Text style={ReportProblemStyles.buttonSaveText} >Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>;
  } else {
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
          <View style={ReportProblemStyles.containerInfo} >
            <Text style={ReportProblemStyles.infoText} >Gracias por ayudarnos a mejorar. Tu reporte será revisado por nuestro equipo.</Text>
            <Text style={ReportProblemStyles.infoText} >Nos pondremos en contacto contigo si necesitamos más información.</Text>
            <TouchableOpacity onPress={() => setPage("ReportProblemList")} >
              <Text style={ReportProblemStyles.linkText} >Ver la lista de reportes</Text>
            </TouchableOpacity>
          </View>
          <View style={ReportProblemStyles.containerSave} >
            <TouchableOpacity style={ReportProblemStyles.containerButtonSave} onPress={handleProblemReport} >
              <Text style={ReportProblemStyles.buttonSaveText} >Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default ReportProblem;
