// =require board/grid
function same_color(node1, node2) {
  if (node1.empty() || node2.empty()) {
    return false;
  }
  if (node1.black() && node2.black()) {
    return true;
  }
  if (node1.white() && node2.white()) {
    return true;
  }

  return false;
};
