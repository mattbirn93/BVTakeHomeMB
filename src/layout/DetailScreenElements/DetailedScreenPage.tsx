import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getRepoLanguages } from '../../apiCalls/repoApis';
import 'react-native-reanimated'
import loadFonts from '../../utils/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking } from 'react-native';

const DetailedScreen = ({ route }) => {
    const [languagesArray, setLanguagesArray] = useState<string[]>([]);
    const { description, url, avatar_image, login, name, watchers_count, forks_count, stargazers_count, languages_url } = route.params;
    const navigation = useNavigation();

  
    function formatCount(num: number) {
        if (num < 1000) return num;
        if (num < 100000) return (num / 1000).toFixed(1) + 'k'; 
        return Math.floor(num / 1000) + 'k';
    }

    const handleGoToRepo = () => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    useEffect(() => {
        getRepoLanguages(languages_url)
            .then(languages => {
                const languageNames = Object.keys(languages);
                setLanguagesArray(languageNames);
            })
            .catch(error => {
                console.error("Failed to fetch languages:", error);
            });
    }, [languages_url]); 

    useEffect(()=>{
        loadFonts()
    },[])
    
    const goBack = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient
            colors={['#E3DCF0', '#F1F1F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            <ScrollView contentContainerStyle={styles.container} style={{flex: 1}}>
                <TouchableOpacity onPress={() => goBack()} style={styles.backIcon}>
                    <IconAnt name='arrowleft' size={24} />
                </TouchableOpacity>
                <View>
                    <Image source={{ uri: avatar_image }} style={styles.avatar} />
                    <Text>
                        <Text style={{ fontFamily: 'SF-Pro-Display-Medium' }}>{login}</Text>
                        <Text style={{ fontFamily: 'SF-Pro-Display-Bold' }}>/{name}</Text>
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsAndIconContainer}>
                            <Icon name="eye" style={styles.icon} />
                            <Text style={styles.statsText}>{formatCount(watchers_count)}</Text>
                        </View>
                        <View style={styles.statsAndIconContainer}>
                            <Icon name="repo-forked" style={styles.icon} />
                            <Text style={styles.statsText}>{formatCount(forks_count)}</Text>
                        </View>
                        <View style={styles.statsAndIconContainer}>
                            <Icon name="star" style={styles.icon} />
                            <Text style={styles.statsText}>{formatCount(stargazers_count)}</Text>
                        </View>
                    </View>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.languagesHeader}>Languages</Text>
                    {languagesArray.map((lang, index) => (
                        <Text key={index} style={styles.language}>{lang}</Text>
                    ))}
                </View>
                <TouchableOpacity onPress={handleGoToRepo} style={styles.goToRepoButton}>
                    <Text style={styles.goToRepoButtonText}>Go to Repo</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 30,
        paddingBottom: 80, 
        paddingTop: 118,  

    },
    statsAndIconContainer: {
        flexDirection: "row",
    },
    backIcon: {
        position: 'absolute',   
        top: 60,   
        left: 30,  
        zIndex: 10,   
    },
    avatar: {
      width: 78,
      height: 78,
      borderRadius: 100,
      marginBottom: 20
    },
    repoName: {
      fontSize: 18,
      color: '#333',
      fontFamily:'SF-Pro-Display-Bold',
      marginBottom: 12
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
      marginTop: 10,
      paddingBottom: 10, 
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
      width: '100%'
    },
    icon: {
      width: 16,
      height: 16,
      color: '#707070'
    },
    statsText: {
      fontSize: 12,
      color: '#707070',
      fontFamily: 'SF-Pro-Display-Semibold'
    },
    description: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'SF-Pro-Display-Regular',
      marginBottom: 10
    },
    languagesHeader: {
      fontSize: 14,
      color: '#333',
      marginTop: 20,
      marginBottom: 16,
      fontFamily:'SF-Pro-Display-Bold',
    },
    language: {
      fontSize: 16,
      color: '#666',
      marginBottom: 5
    },
    goToRepoButton: {
        backgroundColor: '#1F6FEB',
        padding: 10,
        height: 48,
        width: 315,
        borderRadius: 24,
        justifyContent: 'center',  
        alignItems: 'center',     
        marginTop: 50,
        marginBottom: 10,
    },
    goToRepoButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:'SF-Pro-Display-Bold',
    }
  });
  

export default DetailedScreen;
