import ArtList from "../components/ArtList";
import ArtForm from "../components/ArtForm";

const Home = () => {
  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold">Art Portfolio</h1>

      <ArtList />

      <ArtForm />
    </div>
  );
};
export default Home;
