import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const API_KEY = "d4e5c104c01cc6586330e178128ab5b8";  // Pon aquí tu API Key
const BASE_URL = "https://api.themoviedb.org/3";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getMovies = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
    const data = await res.json();
    return data.results;
  };

  const searchMovies = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSearchResults(data.results);
  };

  useEffect(() => {
    (async () => {
      setTrending(await getMovies("/trending/movie/week"));
      setPopular(await getMovies("/movie/popular"));
      setTopRated(await getMovies("/movie/top_rated"));
    })();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchMovies(searchText);
    }, 500); // Espera 500ms después de dejar de escribir

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const renderRow = (title, movies) => (
    <View style={{ marginVertical: 15 }}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie) => (
          <Image
            key={movie.id}
            source={{ uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path }}
            style={styles.poster}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>FilmZone</Text>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar películas..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Mostrar resultados de búsqueda si hay texto */}
      {searchText.length > 0 ? (
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.title}>Resultados para "{searchText}"</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <Image
                  key={movie.id}
                  source={{ uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path }}
                  style={styles.poster}
                />
              ))
            ) : (
              <Text style={{ color: "white", padding: 10 }}>No se encontraron resultados.</Text>
            )}
          </ScrollView>
        </View>
      ) : (
        <>
          {renderRow("Tendencias", trending)}
          {renderRow("Populares", popular)}
          {renderRow("Top Rated", topRated)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  header: {
    color: "red",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#222",
  },
  searchInput: {
    backgroundColor: "#222",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
