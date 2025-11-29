import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_KEY = "d4e5c104c01cc6586330e178128ab5b8";
const BASE_URL = "https://api.themoviedb.org/3";

// ⭐ RATING DE ESTRELLAS
const Rating = ({ rating, votes }: any) => {
  const stars = Math.round(rating / 2);

  return (
    <View style={{ marginTop: 5 }}>
      <Text style={{ color: "gold", fontSize: 14 }}>
        {"★".repeat(stars) + "☆".repeat(5 - stars)}
      </Text>
      <Text style={{ color: "#ccc", fontSize: 12 }}>
        {rating.toFixed(1)} / 10 · {votes} votos
      </Text>
    </View>
  );
};

export default function Index() {
  const router = useRouter();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getMovies = async (endpoint: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
    const data = await res.json();
    return data.results;
  };

  const searchMovies = async (query: any) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
        query
      )}`
    );
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
    const delay = setTimeout(() => searchMovies(searchText), 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  const renderRow = (title: string, movies: any[]) => (
    <View style={{ marginVertical: 15 }}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie: any) => (
          <TouchableOpacity
            key={movie.id}
            onPress={() => router.push(`/movie/${movie.id}`)}
            style={{ marginRight: 10, width: 120 }}
          >
            <Image
              source={{ uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path }}
              style={styles.poster}
            />
            <Rating rating={movie.vote_average} votes={movie.vote_count} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>FilmZone</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar películas..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      {searchText.length > 0 ? (
        <View style={{ marginVertical: 15 }}>
          <Text style={styles.title}>Resultados para "{searchText}"</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchResults.length > 0 ? (
              searchResults.map((movie: any) => (
                <TouchableOpacity
                  key={movie.id}
                  onPress={() => router.push(`/movie/${movie.id}`)}
                  style={{ marginRight: 10, width: 120 }}
                >
                  <Image
                    source={{ uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path }}
                    style={styles.poster}
                  />

                  <Rating rating={movie.vote_average} votes={movie.vote_count} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "white", padding: 10 }}>
                No se encontraron resultados.
              </Text>
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
