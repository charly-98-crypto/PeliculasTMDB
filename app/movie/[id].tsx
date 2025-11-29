import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_KEY = "d4e5c104c01cc6586330e178128ab5b8";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [rating, setRating] = useState(0);

  const animatedScale = useRef(new Animated.Value(1)).current;

  const animateStar = () => {
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStarPress = (value: number) => {
    setRating(value);
    animateStar();
  };

  useEffect(() => {
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, []);

  if (!movie) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  return (
    <>
      {/* Oculta “movie/id”, header transparente + flecha blanca */}
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#ffffff",
        }}
      />

      <ScrollView style={styles.container}>
        {/* Imagen estilo Netflix */}
        <Image
          source={{ uri: "https://image.tmdb.org/t/p/original" + movie.poster_path }}
          style={styles.poster}
        />

        <Text style={styles.title}>{movie.title}</Text>

        {/* Información principal */}
        <Text style={styles.info}>⭐ {movie.vote_average} / 10</Text>
        <Text style={styles.info}>🗳️ {movie.vote_count} votos</Text>
        <Text style={styles.info}>⏳ {movie.runtime || "??"} min</Text>
        <Text style={styles.info}>📅 {movie.release_date}</Text>

        {/* Sinopsis */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.text}>{movie.overview}</Text>

        {/* Calificación */}
        <Text style={styles.sectionTitle}>Calificar esta película</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => handleStarPress(value)}>
              <Animated.Text
                style={[
                  styles.star,
                  {
                    color: value <= rating ? "#E50914" : "#555",
                    transform: [{ scale: animatedScale }],
                  },
                ]}
              >
                ★
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingText}>
            Calificación: {"★".repeat(rating) + "☆".repeat(5 - rating)}
          </Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loading: {
    color: "white",
    margin: 20,
    fontSize: 18,
  },
  poster: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    margin: 15,
  },
  info: {
    color: "#ccc",
    marginLeft: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    margin: 15,
    marginTop: 20,
  },
  text: {
    color: "#bbb",
    marginHorizontal: 15,
    fontSize: 16,
    lineHeight: 22,
  },
  starsContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    marginRight: 8,
  },
  ratingText: {
    color: "#E50914",
    marginLeft: 15,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
