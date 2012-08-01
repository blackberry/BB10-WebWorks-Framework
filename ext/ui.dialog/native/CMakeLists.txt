if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -fexceptions -fPIC ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror -fPIC ${CMAKE_C_FLAGS}")
endif ()

set(dialog_srcs
    dialog_bps.cpp
    dialog_js.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_reader.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_value.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_writer.cpp
    ../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
)

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/include)

add_definitions(-DXP_UNIX)
add_library(dialog MODULE ${dialog_srcs})
target_link_libraries(dialog bps)

set_target_properties(dialog PROPERTIES PREFIX "")

