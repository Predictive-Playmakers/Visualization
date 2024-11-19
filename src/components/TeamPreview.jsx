// This component is a draggind team card
const TeamPreview = ({ team }) => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-blue-500 w-[200px]">
    <div className="flex items-center p-2">
      <div className="w-7 h-7 flex items-center justify-center bg-blue-50 rounded text-xs font-medium text-blue-600">
        {team?.seed || "-"}
      </div>
      <span className="ml-3 text-sm font-medium text-gray-900">
        {team?.name || "TBD"}
      </span>
    </div>
  </div>
);

export default TeamPreview;
