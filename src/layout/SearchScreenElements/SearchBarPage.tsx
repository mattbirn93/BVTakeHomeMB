import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios, { CancelTokenSource } from 'axios';
import { NavigationProp } from '@react-navigation/native';
import RepoCard from './RepoCard';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { getRepoList } from '../../apiCalls/repoApis';
import debounce from 'lodash.debounce';
import { LinearGradient } from 'expo-linear-gradient';
import loadFonts from '../../utils/utils';

interface RepoCardProps {
  name: string;
  description: string;
  url: string;
  avatar_image: string;
  login: string;
  languages_url: string;
  watchers_count: number;
  forks_count: number;
  stargazers_count: number;
  regularFont: string;
  mediumFont: string;
}

interface SearchBarPageProps {
  navigation: NavigationProp<any>; 
}

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 500;

const SearchBarPage: React.FC<SearchBarPageProps> = ({ navigation }) => {
    const [query, setQuery] = useState<string>('');
    const [repos, setRepos] = useState<RepoCardProps[]>([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [lastFetchedQuery, setLastFetchedQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(null);
    const [headerVisible, setHeaderVisible] = useState(true);

    const fetchRepositories = async () => {
        if (!query || query.length < MIN_QUERY_LENGTH || query === lastFetchedQuery) {
            setLoading(false)
            return;
        }
        setLoading(true);
        const newCancelToken = axios.CancelToken.source();
        if (cancelToken) {
            cancelToken.cancel("Operation canceled due to new request.");
            setLoading(true)
        }
        setCancelToken(newCancelToken);

        try {
            const response = await getRepoList(query, newCancelToken);
            const filteredData = response.data.items.map((item: any) => ({
                description: item.description,
                url: item.svn_url,
                avatar_image: item.owner.avatar_url,
                login: item.owner.login,
                name: item.name,
                languages_url: item.languages_url,
                watchers_count: item.watchers_count,
                forks_count: item.forks_count,
                stargazers_count: item.stargazers_count
            }));
            setRepos(filteredData);
            setLastFetchedQuery(query);
            setLoading(false);
        } catch (error) {
            if (axios.isCancel(error)) {

            } else {

                setLoading(false);
            }
        }
    };

    const handleScroll = (event: { nativeEvent: { contentOffset: { y: any; }; }; }) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        setHeaderVisible(scrollOffset <= 10);  
    };
    
    const clearSearch = () => {
      setQuery('');
      setRepos([]);
      setLastFetchedQuery('')
      cancelToken?.cancel("Operation canceled by clearing the search.");
    };

    const debouncedFetchRepositories = useMemo(() => debounce(fetchRepositories, DEBOUNCE_DELAY), [fetchRepositories]);


useEffect(() => {
    if (query.length >= MIN_QUERY_LENGTH) {
        debouncedFetchRepositories();
        setLoading(true)
    } else {
        setLoading(false)
        setRepos([]);
    }
    return () => {
        debouncedFetchRepositories.cancel();
    };
}, [query]);

useEffect(() => {
    async function prepareResources() {
        try {
            await loadFonts();
            setFontsLoaded(true);
        } catch (error) {
            console.error("Error loading fonts", error);
        }
    }
    prepareResources();
}, []);

if (!fontsLoaded) {
    return (
        <LinearGradient
        colors={['#E3DCF0', '#F1F1F1']}  
        start={{ x: 0, y: 0 }}  
        end={{ x: 0, y: 1 }}  
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}  

    >
    <ActivityIndicator size="large" color="#0000ff" />
    </LinearGradient>
    )
}


    return (
        <LinearGradient
            colors={['#E3DCF0', '#F1F1F1']}  
            start={{ x: 0, y: 0 }}  
            end={{ x: 0, y: 1 }}  
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={styles.headerAndSearchContainer}>
                    {headerVisible &&  
                    <View style={styles.containerHeader}>
                        <IconAnt name="github" size={40}/>
                        <Text style={styles.textHeader}>GitHub Repo Search</Text>
                    </View>}
                    <View style={[
                        styles.searchBox,
                        !headerVisible ? styles.border : {}
                    ]}>
                        <View style={styles.searchContainer}>
                            <Icon name="magnify" size={24} color="#000" />
                            <TextInput
                                placeholder="Search"
                                style={styles.searchInput}
                                onChangeText={setQuery}
                                value={query}
                            />
                            {query && (
                                <TouchableOpacity onPress={clearSearch}>
                                    <Icon name="close" size={18} color="#A4A4A4" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="grey" />
                ) : (
                    <FlatList
                        data={repos}
                        keyExtractor={(item, index) => `${item.login}${index}`}
                        renderItem={({ item }) => (
                            <RepoCard
                                {...item}
                                navigation={navigation}
                                regularFont="SF-Pro-Display-Regular"
                                mediumFont="SF-Pro-Display-Medium"
                                boldFont="SF-Pro-Display-Bold"
                                query={query}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />
                )}
            </View>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 50,
        alignItems: 'center'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        width: 315,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    headerAndSearchContainer: {
        width: '100%', 
        alignItems: 'center', 
    },
    searchBox: {
        width: '100%',
        alignItems: 'center',
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#D9D2E5',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'SF-Pro-Display-Regular',
        color: '#000000'
    },
    icon: {
        marginRight: 10,
    },
    containerHeader: {
        flexDirection: "row",
        marginTop: 30,
        marginBottom: 24,
        marginRight: 135,
        alignItems: 'center',  
      },
      textHeader: {
        fontSize: 14,
        marginLeft: 10,
        fontFamily: 'SF-Pro-Display-Bold'  
      },
});


export default SearchBarPage;
