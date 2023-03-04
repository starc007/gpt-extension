import React, { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { ProfileType } from "../api";
import DeleteModal from "./DeleteModal";

const Profiles = () => {
  const {
    profiles,
    isDeleteProfileModalOpen,
    setIsDeleteProfileModalOpen,
    setEditData,
    setIsAddProfileModalOpen,
  } = useAuth();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [filteredProfiles, setFilteredProfiles] = React.useState<
    ProfileType[] | []
  >(profiles);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filtered = profiles.filter((profile: ProfileType) => {
      const { title, bio, skills } = profile.toneDescription;
      const skillsString = skills.map((skill) => skill).join(" ");
      return (
        title.toLowerCase().includes(value.toLowerCase()) ||
        bio.toLowerCase().includes(value.toLowerCase()) ||
        skillsString.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredProfiles(filtered);
  };

  useEffect(() => {
    setFilteredProfiles(profiles);
  }, [profiles]);

  return (
    <div className="">
      <div className="border rounded-lg my-10 ">
        <div className="flex items-center border border-gray-300 rounded-lg  mx-4 mt-4 w-[450px] h-12">
          <img src="search.svg" alt="search" className="w-5 h-5 ml-3" />
          <input
            type="text"
            placeholder="Search by Profile title, skills"
            className="px-2 h-full w-[400px] focus:outline-none text-gray-600"
            onChange={handleSearch}
          />
        </div>

        <table className="w-full rounded-lg mt-4">
          <thead>
            <tr className="border-b bg-gray-100 border-t h-12 text-gray-600 text-sm font-medium">
              <th className="text-left px-4">Profile Title</th>
              <th className="text-left">Bio</th>
              <th className="text-left">Last Updated</th>
              <th className="text-left">Skills</th>
              <th className="text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles?.map((profile: ProfileType, i) => (
              <tr
                key={profile.id}
                className={`h-auto hover:bg-lightPurple ${
                  //dont add border bottom to last row
                  profiles.length - 1 === i ? "" : "border-b"
                } `}
              >
                <td className="px-4 text-sm text-gray-600 font-medium py-6">
                  {profile.toneDescription.title}
                </td>
                <td className="md:w-80 w-64 py-4 text-gray-500">
                  <p className="break-words whitespace-normal">
                    {profile.toneDescription.bio}
                  </p>
                </td>
                <td className="text-gray-500">
                  {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="w-auto flex flex-wrap py-6">
                  {profile.toneDescription.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-2 mx-1 text-xs bg-darkPurple text-white rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </td>
                <td className="w-28 ">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setEditData(profile);
                        setIsAddProfileModalOpen(true);
                      }}
                      className="w-10"
                    >
                      <img src="edit.svg" alt="edit" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(profile.id);
                        setIsDeleteProfileModalOpen(true);
                      }}
                      className="w-10"
                    >
                      <img src="delete.svg" alt="edit" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteProfileModalOpen && <DeleteModal selectedId={selectedId} />}
    </div>
  );
};

export default Profiles;
