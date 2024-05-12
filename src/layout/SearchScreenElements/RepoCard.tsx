import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import loadFonts from '../../utils/utils';

interface RepoCardProps {
  description: string;
  name: string;
  login: string;
  url: string;
  avatar_image: string;
  languages_url: string;
  watchers_count: number;
  forks_count: number;
  stargazers_count: number;
  navigation: any;  
  regularFont: string;
  mediumFont: string;
  boldFont: string;
  query: string;
}

const RepoCard: React.FC<RepoCardProps> = ({
    description,
    url,
    avatar_image,
    login,
    name,
    languages_url,
    watchers_count,
    forks_count,
    stargazers_count,
    navigation,
    regularFont,
    mediumFont,
    boldFont,
    query
}) => {
    
  const highlightText = (text: string, query: string) => {
    if (!query) return <Text style={{ fontFamily: mediumFont }}>{text}</Text>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === query.toLowerCase() 
      ? <Text key={index} style={{ fontFamily: boldFont }}>{part}</Text> 
      : <Text key={index} style={{ fontFamily: mediumFont }}>{part}</Text>
    ));
  };

  return (
    <TouchableOpacity 
        onPress={() => navigation.push('Details', {
            description,
            url,
            avatar_image,
            languages_url,
            watchers_count,
            login,
            name,
            forks_count,
            stargazers_count,
        })}
    >
       <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image source={{ uri: avatar_image }} style={styles.avatar} />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: mediumFont }]} numberOfLines={1} ellipsizeMode="tail">
          {login}/
          {highlightText(name, query)}
        </Text>
      </View>
    </View>
    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.subtitle, { fontFamily: regularFont }]}>
      {description}
    </Text>
  </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        gap: 10,
        width: 315,
        backgroundColor: '#fbfbfb',  
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 10,
      },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,  
},
  title: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    color: '#242424',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 10
  }
});

export default RepoCard;
