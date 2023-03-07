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

  const [selectedId, setSelectedId] = React.useState<ProfileType | null>(null);

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

  // console.log("profiles", profiles);

  return (
    <>
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
            {filteredProfiles?.map(
              (profile: ProfileType, i) =>
                profile?.toneDescription?.bio &&
                profile?.toneDescription?.title &&
                profile?.toneDescription?.skills && (
                  <tr
                    key={profile.id}
                    className={`h-auto hover:bg-lightPurple ${
                      profiles.length - 1 === i ? "" : "border-b"
                    } `}
                  >
                    <td className="px-4  py-6 w-64">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-600 font-medium truncate w-64">
                          {profile.toneDescription.title}
                        </p>
                        {profile?.default && (
                          <p className="w-16 h-7 mt-1 text-primary text-xs flex items-center justify-center border border-primary/40 bg-primary/20 rounded-lg">
                            Default
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="md:w-80 w-64 py-4 text-gray-500">
                      <p className="break-all pr-4">
                        {profile.toneDescription.bio.length > 300
                          ? profile.toneDescription.bio.slice(0, 300) + "..."
                          : profile.toneDescription.bio}
                      </p>
                    </td>
                    <td className="text-gray-500 w-52">
                      {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="w-96 flex flex-wrap py-6">
                      {profile.toneDescription.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-2 m-1 text-xs bg-darkPurple text-white rounded-full"
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
                          className="w-10 "
                        >
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hover:fill-primary hover:stroke-primary transition-all duration-300"
                          >
                            <g clipPath="url(#clip0_203_39375)">
                              <path
                                d="M24.167 12.4999C24.3859 12.2811 24.6457 12.1074 24.9317 11.989C25.2176 11.8705 25.5241 11.8096 25.8337 11.8096C26.1432 11.8096 26.4497 11.8705 26.7357 11.989C27.0216 12.1074 27.2815 12.2811 27.5003 12.4999C27.7192 12.7188 27.8928 12.9786 28.0113 13.2646C28.1297 13.5506 28.1907 13.8571 28.1907 14.1666C28.1907 14.4761 28.1297 14.7826 28.0113 15.0686C27.8928 15.3546 27.7192 15.6144 27.5003 15.8333L16.2503 27.0833L11.667 28.3333L12.917 23.7499L24.167 12.4999Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_203_39375">
                                <rect
                                  width="20"
                                  height="20"
                                  // fill="white"

                                  transform="translate(10 10)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(profile);
                            setIsDeleteProfileModalOpen(true);
                          }}
                          className="w-10"
                        >
                          {/* <img src="delete.svg" alt="edit" /> */}
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hover:stroke-red-500 stroke-gray-500 transition-all duration-300"
                          >
                            <path
                              d="M12.5 15.0001H14.1667M14.1667 15.0001H27.5M14.1667 15.0001V26.6667C14.1667 27.1088 14.3423 27.5327 14.6548 27.8453C14.9674 28.1578 15.3913 28.3334 15.8333 28.3334H24.1667C24.6087 28.3334 25.0326 28.1578 25.3452 27.8453C25.6577 27.5327 25.8333 27.1088 25.8333 26.6667V15.0001H14.1667ZM16.6667 15.0001V13.3334C16.6667 12.8914 16.8423 12.4675 17.1548 12.1549C17.4674 11.8423 17.8913 11.6667 18.3333 11.6667H21.6667C22.1087 11.6667 22.5326 11.8423 22.8452 12.1549C23.1577 12.4675 23.3333 12.8914 23.3333 13.3334V15.0001M18.3333 19.1667V24.1667M21.6667 19.1667V24.1667"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        {filteredProfiles.length === 0 && (
          <div className=" w-full text-center text-base text-gray-600 my-4 ">
            No profiles found
          </div>
        )}
      </div>

      {isDeleteProfileModalOpen && <DeleteModal selectedProfile={selectedId} />}
    </>
  );
};

export default Profiles;
