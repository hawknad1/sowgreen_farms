import CategoryCard from "../CategoryCard";
import { getCategories } from "@/lib/utils";
import { TCategory } from "@/types";

interface CategoryProps {
  id: string;
  categoryName: string;
  imageUrl: string;
  link: string;
}

const CategoryCards: React.FC<CategoryProps> = async () => {
  // const [categoryList, setcategoryList] = useState([]);
  const categories = await getCategories();

  // useEffect(() => {
  //   getCategoryList();
  // }, []);

  // const getCategoryList = () => {
  //   GlobalApi.getCategory().then((res: any) => {
  //     setcategoryList(res.data.data);
  //   });
  // };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center space-x-4 p-4 w-max ">
        {categories.map((card: CategoryProps) => (
          <CategoryCard data={card} key={card.id} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
