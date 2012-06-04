include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/jnext_1_0_8_3/jncore/jnext-core/Win-Linux-npapi/gecko-sdk/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common)

set(connection_srcs
    connection_bps.cpp
    connection_js.cpp
    ../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
)

add_subdirectory(unitTests)

if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-fexceptions -fPIC ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-fPIC ${CMAKE_C_FLAGS}")
endif ()

add_definitions(-DXP_UNIX)
add_library(netstatus MODULE ${connection_srcs})
target_link_libraries(netstatus bps)

set_target_properties(netstatus PROPERTIES PREFIX "")

