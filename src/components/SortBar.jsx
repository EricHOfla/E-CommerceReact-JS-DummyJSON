const SortBar = ({ sortBy, setSortBy, order, setOrder }) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border p-2"
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="title">Name</option>
        <option value="rating">Rating</option>
      </select>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="border p-2"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortBar;
