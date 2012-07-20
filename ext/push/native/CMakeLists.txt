include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/jnext_1_0_8_3/jncore/jnext-core/Win-Linux-npapi/gecko-sdk/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/include)

set(push_srcs
    push_js.cpp
    push_ndk.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_reader.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_value.cpp
    ../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_writer.cpp
    ../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
)

add_subdirectory(unitTests)

if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-fexceptions -fPIC ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-fPIC ${CMAKE_C_FLAGS}")
endif ()

add_definitions(-DXP_UNIX)
add_library(pushJNext MODULE ${push_srcs})
target_link_libraries(pushJNext PushService)

set_target_properties(pushJNext PROPERTIES PREFIX "")

